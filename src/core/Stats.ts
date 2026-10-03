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
import type { HeatState } from '../gameplay/HeatMeter';
import { logEvent } from '../utils/log';

export const MIN_RATING = 1.0;
export const MAX_RATING = 5.0;
export const MAX_CRASHES = 3;

export class Stats {
  cash = 0;
  xp = 0;
  rating = MAX_RATING;
  timeLeft = SHIFT_TIME;
  streak = 0;
  crashes = 0;

  reset(): void {
    this.cash = 0;
    this.xp = 0;
    this.rating = MAX_RATING;
    this.timeLeft = SHIFT_TIME;
    this.streak = 0;
    this.crashes = 0;
  }

  streakBonus(): number {
    return this.streak * STREAK_BONUS;
  }

  tick(dt: number): void {
    this.timeLeft = Math.max(0, this.timeLeft - dt);
  }

  isShiftOver(): boolean {
    return this.timeLeft <= 0 || this.crashes >= MAX_CRASHES;
  }

  applyDelivery(payout: number, heat: HeatState): void {
    this.cash += payout;
    if (heat === 'hot') {
      this.streak += 1;
      this.xp += XP_HOT;
      this.rating = Math.min(MAX_RATING, this.rating + RATING_HOT);
    } else if (heat === 'warm') {
      this.streak = 0;
      this.xp += XP_WARM;
    } else {
      this.streak = 0;
      this.xp += XP_COLD;
      this.rating = Math.max(MIN_RATING, this.rating + RATING_COLD);
    }
    this.timeLeft = Math.min(MAX_TIME, this.timeLeft + TIME_BONUS);
    logEvent('payout', `delivered +₦${payout}`, {
      heat,
      cash: this.cash,
      xp: this.xp,
      rating: +this.rating.toFixed(1),
      streak: this.streak,
      timeLeft: Math.ceil(this.timeLeft),
    });
  }

  registerCrash(): void {
    this.crashes += 1;
    this.streak = 0;
    this.rating = Math.max(MIN_RATING, this.rating + RATING_CRASH);
    logEvent('crash', `crash #${this.crashes}`, { rating: this.rating });
  }

  registerBump(): void {
    this.crashes += 1;
    this.streak = 0;
    logEvent('crash', `bump #${this.crashes} (vendor, no rating loss)`, {
      rating: this.rating,
    });
  }
}
