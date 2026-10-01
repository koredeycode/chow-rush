export interface Dish {
  id: string;
  name: string;
  heatCapacity: number;
  basePrice: number;
}

export const DISHES: readonly Dish[] = [
  { id: 'jollof', name: 'Jollof Rice', heatCapacity: 30, basePrice: 500 },
  { id: 'suya', name: 'Suya', heatCapacity: 45, basePrice: 300 },
  { id: 'puff', name: 'Puff Puff', heatCapacity: 20, basePrice: 200 },
];
