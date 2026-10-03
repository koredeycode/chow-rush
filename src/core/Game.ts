import { Bike } from '../player/Bike';
import { BikeController } from '../player/BikeController';
import { Keyboard, getCombinedInput } from '../systems/Input';
import { Touch } from '../systems/TouchInput';
import { deliverJingle, pickupDing, beep } from '../audio/beep';
import { HUD } from '../ui/HUD';
import { CityScroller } from '../world/CityScroller';
import { DeliveryManager } from '../gameplay/DeliveryManager';
import { HeatMeter, type HeatState } from '../gameplay/HeatMeter';
import { ObstacleManager } from '../gameplay/Obstacles';
import { logEvent } from '../utils/log';
import { CameraRig } from './Camera';
import { Engine } from './Engine';
import { GameState, State, saveBest } from './GameState';
import { Stats } from './Stats';

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
  private readonly stats = new Stats();
  private lastOrderId: string | null = null;
  private lastHeat: HeatState | null = null;
  private prevAirborne = false;

  constructor() {
    this.rig = new CameraRig(this.engine.camera);
    this.controller = new BikeController(this.bike);
    this.delivery = new DeliveryManager(this.engine.scene);
    this.obstacles = new ObstacleManager(this.engine.scene);
    this.scroller.init(this.engine.scene);
    this.engine.scene.add(this.bike.mesh);
  }

  start(): void {
    this.stats.reset();
    this.lastOrderId = null;
    this.lastHeat = null;
    const first = this.delivery.spawnOrder(0);
    logEvent('state', 'shift start → PLAYING', {
      pickup: first.pickupDistance,
      drop: first.dropoffDistance,
      lane: first.lane,
      dish: first.dish.id,
    });
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

  update(rawDt: number): void {
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
    );
    if (hits.vendor) {
      this.bike.crash();
      this.stats.registerBump();
      beep(90, 0.25, 'square');
    }
    if (hits.ped) {
      this.bike.crash();
      this.stats.registerCrash();
      beep(90, 0.25, 'square');
    }
    this.scroller.update(dt, this.bike.speed * this.obstacles.speedMultiplier());
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
        this.heat.reset(order.dish.heatCapacity);
        this.lastHeat = 'hot';
        pickupDing();
        logEvent('order', 'picked up', {
          id: order.id,
          dish: order.dish.name,
          cap: order.dish.heatCapacity,
        });
      }
    } else if (result.event === 'delivered') {
      this.stats.applyDelivery(result.payout, this.heat.getState());
      deliverJingle();
      this.lastHeat = null;
    }

    const active = this.delivery.getCurrentOrder();
    if (active && active.id !== this.lastOrderId) {
      this.lastOrderId = active.id;
      logEvent('order', 'spawned', {
        id: active.id,
        dish: active.dish.name,
        base: active.dish.basePrice,
        pickup: active.pickupDistance,
        drop: active.dropoffDistance,
        lane: active.lane,
      });
    }

    this.stats.tick(dt);
    if (this.stats.isShiftOver()) {
      const best = saveBest(this.stats.cash, this.stats.xp);
      logEvent('state', 'shift end → RESULTS', {
        reason: this.stats.timeLeft <= 0 ? 'timeout' : 'crashes',
        cash: this.stats.cash,
        xp: this.stats.xp,
        rating: this.stats.rating,
        best,
      });
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
