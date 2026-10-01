import {
  MAX_TIME,
  RATING_COLD,
  RATING_CRASH,
  RATING_HOT,
  SHIFT_TIME,
  STREAK_BONUS,
  TIME_BONUS,
  XP_COLD,
  XP_HOT,
  XP_WARM,
} from '../data/economy';
import { Bike } from '../player/Bike';
import { BikeController } from '../player/BikeController';
import { Keyboard, getCombinedInput } from '../systems/Input';
import { Touch } from '../systems/TouchInput';
import { HUD } from '../ui/HUD';
import { CityScroller } from '../world/CityScroller';
import { DeliveryManager } from '../gameplay/DeliveryManager';
import { HeatMeter } from '../gameplay/HeatMeter';
import { CameraRig } from './Camera';
import { Engine } from './Engine';
import { GameState, State, saveBest } from './GameState';

const MIN_RATING = 1.0;
const MAX_RATING = 5.0;
const MAX_CRASHES = 3;

export class Game {
  private readonly engine = new Engine('game-canvas');
  private readonly rig: CameraRig;
  private readonly bike = new Bike();
  private readonly controller: BikeController;
  private readonly scroller = new CityScroller();
  private readonly delivery: DeliveryManager;
  private readonly heat = new HeatMeter();
  private readonly hud = new HUD();
  private readonly keyboard = new Keyboard();
  private readonly touch = new Touch();
  private readonly state = new State();

  private cash = 0;
  private xp = 0;
  private rating = MAX_RATING;
  private timeLeft = SHIFT_TIME;
  private streak = 0;
  private crashes = 0;

  constructor() {
    this.rig = new CameraRig(this.engine.camera);
    this.controller = new BikeController(this.bike);
    this.delivery = new DeliveryManager(this.engine.scene);
    this.scroller.init(this.engine.scene);
    this.engine.scene.add(this.bike.mesh);
  }

  start(): void {
    this.cash = 0;
    this.xp = 0;
    this.rating = MAX_RATING;
    this.timeLeft = SHIFT_TIME;
    this.streak = 0;
    this.crashes = 0;
    this.delivery.spawnOrder(0);
    this.state.setState(GameState.PLAYING);
  }

  pause(): void {
    if (this.state.isPlaying()) this.state.setState(GameState.PAUSED);
  }

  resume(): void {
    if (this.state.current === GameState.PAUSED) {
      this.state.setState(GameState.PLAYING);
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
    this.scroller.update(dt, this.bike.speed);
    const track = this.scroller.getTrackDistance();

    const carrying =
      this.delivery.getCurrentOrder()?.getState() === 'delivering';
    if (carrying) this.heat.update(dt);

    const heatMult = this.heat.getTipMultiplier();
    const streakBonus = this.streak * STREAK_BONUS;
    const result = this.delivery.update(
      this.bike.laneIndex,
      track,
      heatMult,
      streakBonus,
    );

    if (result.event === 'picked') {
      const order = this.delivery.getCurrentOrder();
      if (order) this.heat.reset(order.dish.heatCapacity);
    } else if (result.event === 'delivered') {
      this.applyDelivery(result.payout);
    }

    this.timeLeft -= dt;
    if (this.timeLeft <= 0 || this.crashes >= MAX_CRASHES) {
      this.timeLeft = Math.max(0, this.timeLeft);
      saveBest(this.cash, this.xp);
      this.state.setState(GameState.RESULTS);
    }

    this.rig.update(dt, this.bike.getPosition());
    this.hud.update({
      cash: this.cash,
      heatPercent: carrying ? this.heat.getPercent() : 0,
      rating: this.rating,
      timeLeft: this.timeLeft,
    });
  }

  render(): void {
    this.engine.render();
  }

  private applyDelivery(payout: number): void {
    this.cash += payout;
    const heatState = this.heat.getState();
    if (heatState === 'hot') {
      this.streak += 1;
      this.xp += XP_HOT;
      this.rating = Math.min(MAX_RATING, this.rating + RATING_HOT);
    } else if (heatState === 'warm') {
      this.streak = 0;
      this.xp += XP_WARM;
    } else {
      this.streak = 0;
      this.xp += XP_COLD;
      this.rating = Math.max(MIN_RATING, this.rating + RATING_COLD);
    }
    this.timeLeft = Math.min(MAX_TIME, this.timeLeft + TIME_BONUS);
  }

  registerCrash(): void {
    this.crashes += 1;
    this.streak = 0;
    this.rating = Math.max(MIN_RATING, this.rating + RATING_CRASH);
  }
}
