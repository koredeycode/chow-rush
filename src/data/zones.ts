export interface Zone {
  id: string;
  name: string;
  startDist: number;
  fogColor: number;
  density: number;
  traffic: 'light' | 'medium' | 'heavy' | 'very heavy';
  weather: 'clear' | 'rain' | 'rain + night';
  unlockLevel: number;
}

export const ZONE_LENGTH = 2000;

export const ZONES: readonly Zone[] = [
  { id: 'yaba', name: 'Yaba', startDist: 0, fogColor: 0x87ceeb, density: 1, traffic: 'light', weather: 'clear', unlockLevel: 1 },
  { id: 'ojuelegba', name: 'Ojuelegba', startDist: 2000, fogColor: 0x9fc3d8, density: 1.4, traffic: 'medium', weather: 'clear', unlockLevel: 3 },
  { id: 'ikeja', name: 'Ikeja', startDist: 4000, fogColor: 0xb8c4c4, density: 1.8, traffic: 'heavy', weather: 'clear', unlockLevel: 6 },
  { id: 'vi', name: 'Victoria Island', startDist: 6000, fogColor: 0x6f7f8c, density: 2.2, traffic: 'heavy', weather: 'rain', unlockLevel: 10 },
  { id: 'lekki', name: 'Lekki', startDist: 8000, fogColor: 0x3a4a5a, density: 2.8, traffic: 'very heavy', weather: 'rain + night', unlockLevel: 15 },
];

export function zoneIndexAt(trackDist: number): number {
  const idx = Math.floor(trackDist / ZONE_LENGTH);
  return Math.min(ZONES.length - 1, Math.max(0, idx));
}
