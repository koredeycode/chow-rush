import { Bike } from '../player/Bike';
import { BikeController } from '../player/BikeController';
import { Keyboard, getCombinedInput } from '../systems/Input';
import { Touch } from '../systems/TouchInput';
import { deliverJingle, pickupDing, beep } from '../audio/beep';
import { HUD } from '../ui/HUD';
import { Garage } from '../ui/Garage';
import { CityScroller } from '../world/CityScroller';
import { DeliveryManager } from '../gameplay/DeliveryManager';
import { HeatMeter, type HeatState } from '../gameplay/HeatMeter';
import { ObstacleManager } from '../gameplay/Obstacles';
import { logEvent } from '../utils/log';
import { CameraRig } from './Camera';
import { Engine } from './Engine';
import { GameState, State } from './GameState';
import { Stats } from './Stats';
import { UpgradeShop } from './UpgradeShop';
import type { UpgradeId } from '../data/upgrades';

export class Game {
  private readonly engine = new Engine('game-canvas');
  private readonly rig: CameraRig;
  private readonly bike = new Bike();
  private readonly controller: BikeController;
  private readonly scroller = new CityScroller();
  private readonly delivery: DeliveryManager;
  private readonly obstacles: ObstacleManager;
  private readonly heat = new HeatMeter();
  private readonly hud = new HUD();
  private readonly keyboard = new Keyboard();
  private readonly touch = new Touch();
  private readonly state = new State();
  readonly stats = new Stats();
  private readonly shop: UpgradeShop;
  private readonly garage: Garage;
  private garageOpen = false;
  private lastHeat: HeatState | null = null;
  private prevAirborne = false;

  constructor() {
    this.rig = new CameraRig(this.engine.camera);
    this.controller = new BikeController(this.bike);
    this.delivery = new DeliveryManager(this.engine.scene);
    this.obstacles = new ObstacleManager(this.engine.scene);
    this.scroller.init(this.engine.scene);
    this.engine.scene.add(this.bike.mesh);
    this.shop = new UpgradeShop(this.bike);
    this.shop.loadInto(this.stats);
    this.garage = new Garage(
      () => ({ wallet: this.stats.wallet, levels: this.shop.levels() }),
      (id: UpgradeId) => {
        this.shop.buy(id, this.stats);
        this.garage.refresh();
      },
      () => this.setGarageOpen(false),
    );
  }

  start(): void {
    this.stats.reset();
    this.lastHeat = null;
    this.garage.hide();
    this.garageOpen = false;
    const first = this.delivery.spawnOrder(0);
    logEvent('state', 'shift start → PLAYING', { pickup: first.pickupDistance, drop: first.dropoffDistance, lane: first.lane, dish: first.dish.id });
    this.state.setState(GameState.PLAYING);
  }

  pause(): void {
    if (this.state.isPlaying()) {
      this.state.setState(GameState.PAUSED);
      logEvent('state', 'pause → PAUSED');
    }
  }

  resume(): void {
    if (this.state.current === GameState.PAUSED) {
      this.state.setState(GameState.PLAYING);
      logEvent('state', 'resume → PLAYING');
    }
  }

  getState(): GameState {
    return this.state.current;
  }

  toggleGarage(): void {
    this.setGarageOpen(!this.garageOpen);
  }

  private setGarageOpen(open: boolean): void {
    this.garageOpen = open;
    if (open) {
      this.pause();
      this.garage.show();
      logEvent('state', 'garage opened');
    } else {
      this.garage.hide();
      this.resume();
    }
  }

  update(rawDt: number): void {
    if (this.garageOpen) return;
    if (!this.state.isPlaying()) return;
    const dt = Math.min(0.05, rawDt);

    const input = getCombinedInput(
      this.keyboard.getInput(),
      this.touch.getInput(),
    );
    this.controller.update(dt, input);
    const airborne = this.bike.isAirborne();
    if (airborne && !this.prevAirborne) logEvent('input', 'hop → airborne');
    this.prevAirborne = airborne;
    const hits = this.obstacles.update(
      dt,
      this.scroller.getTrackDistance(),
      this.bike.laneIndex,
      airborne,
      input.horn,
      this.scroller.getDensity(),
      this.shop.hornRadius(),
    );
    if (hits.vendor) {
      this.bike.crash();
      this.stats.registerBump();
      this.rig.addShake(0.5);
      beep(90, 0.25, 'square');
    }
    if (hits.ped) {
      this.bike.crash();
      this.stats.registerCrash();
      this.rig.addShake(0.7);
      beep(90, 0.25, 'square');
    }
    this.scroller.update(dt, this.bike.speed * this.obstacles.speedMultiplier(), this.bike.getPosition());
    const track = this.scroller.getTrackDistance();

    const carrying =
      this.delivery.getCurrentOrder()?.getState() === 'delivering';
    if (carrying) {
      this.heat.update(dt);
      const hs = this.heat.getState();
      if (this.lastHeat !== null && hs !== this.lastHeat) {
        logEvent('heat', `cooling → ${hs}`, {
          pct: +this.heat.getPercent().toFixed(2),
        });
      }
      this.lastHeat = hs;
    }

    const result = this.delivery.update(
      this.bike.laneIndex,
      track,
      this.heat.getTipMultiplier(),
      this.stats.streakBonus(),
    );

    if (result.event === 'picked') {
      const order = this.delivery.getCurrentOrder();
      if (order) {
        this.heat.reset(order.dish.heatCapacity, this.shop.thermalMult());
        this.lastHeat = 'hot';
        pickupDing();
      }
    } else if (result.event === 'delivered') {
      this.stats.applyDelivery(result.payout, this.heat.getState());
      deliverJingle();
      this.lastHeat = null;
    }

    this.stats.tick(dt);
    if (this.stats.isShiftOver()) {
      this.stats.finishShift();
      this.shop.syncFrom(this.stats);
      this.state.setState(GameState.RESULTS);
    }

    this.rig.update(dt, this.bike.getPosition());
    this.hud.update({
      cash: this.stats.cash,
      heatPercent: carrying ? this.heat.getPercent() : 0,
      rating: this.stats.rating,
      timeLeft: this.stats.timeLeft,
    });
  }

  render(): void {
    this.engine.render();
  }

  registerCrash(): void {
    this.stats.registerCrash();
  }
}
