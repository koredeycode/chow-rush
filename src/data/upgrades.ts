export type UpgradeId = 'engine' | 'thermal' | 'horn';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  desc: string;
  costs: readonly number[];
  maxLevel: number;
}

export const UPGRADES: readonly UpgradeDef[] = [
  { id: 'engine', name: 'Engine', desc: '+10 top speed / lvl', costs: [500, 1500, 3000], maxLevel: 3 },
  { id: 'thermal', name: 'Thermal Bag', desc: '+25% heat time / lvl', costs: [500, 1500, 3000], maxLevel: 3 },
  { id: 'horn', name: 'Horn', desc: '+10m clear radius / lvl', costs: [400, 1000, 2000], maxLevel: 3 },
];

export const ENGINE_SPEED_PER_LEVEL = 10;
export const THERMAL_MULT_PER_LEVEL = 0.25;
export const HORN_RADIUS_PER_LEVEL = 10;
