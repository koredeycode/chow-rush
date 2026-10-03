import { MAX_SPEED } from '../data/bikeConfig';
import { HORN_RADIUS } from '../data/obstacles';
import {
  ENGINE_SPEED_PER_LEVEL,
  HORN_RADIUS_PER_LEVEL,
  THERMAL_MULT_PER_LEVEL,
  UPGRADES,
  type UpgradeId,
} from '../data/upgrades';
import { logEvent } from '../utils/log';
import type { Bike } from '../player/Bike';
import {
  loadProgress,
  saveProgress,
  type Progress,
} from './GameState';
import type { Stats } from './Stats';

export class UpgradeShop {
  private data: Progress = loadProgress();

  constructor(private readonly bike: Bike) {
    this.applyEngine();
  }

  levels(): Record<UpgradeId, number> {
    return { ...this.data.upgrades };
  }

  syncFrom(stats: Stats): void {
    this.data.wallet = stats.wallet;
    this.data.totalXp = stats.totalXp;
    saveProgress(this.data);
  }

  loadInto(stats: Stats): void {
    stats.wallet = this.data.wallet;
    stats.totalXp = this.data.totalXp;
    this.applyEngine();
  }

  thermalMult(): number {
    return 1 + THERMAL_MULT_PER_LEVEL * this.data.upgrades.thermal;
  }

  hornRadius(): number {
    return HORN_RADIUS + HORN_RADIUS_PER_LEVEL * this.data.upgrades.horn;
  }

  buy(id: UpgradeId, stats: Stats): boolean {
    const def = UPGRADES.find((u) => u.id === id);
    if (!def) return false;
    const lv = this.data.upgrades[id];
    const cost = def.costs[lv];
    if (lv >= def.maxLevel || cost === undefined) {
      logEvent('garage', `${id} already maxed`);
      return false;
    }
    if (stats.wallet < cost) {
      logEvent('garage', `can't afford ${id} (${cost})`, {
        wallet: stats.wallet,
      });
      return false;
    }
    stats.wallet -= cost;
    this.data.upgrades[id] = lv + 1;
    this.applyEngine();
    this.syncFrom(stats);
    logEvent('garage', `bought ${id} lv${lv + 1}`, { wallet: stats.wallet });
    return true;
  }

  private applyEngine(): void {
    this.bike.setTopSpeed(
      MAX_SPEED + ENGINE_SPEED_PER_LEVEL * this.data.upgrades.engine,
    );
  }
}
