export interface Restaurant {
  id: string;
  name: string;
  dishIds: string[];
}

export const RESTAURANTS: readonly Restaurant[] = [
  { id: 'mamaput', name: 'Mama Put', dishIds: ['jollof', 'puff'] },
  { id: 'suyaspot', name: 'Suya Spot', dishIds: ['suya'] },
  { id: 'amalahouse', name: 'Amala House', dishIds: ['amala'] },
  { id: 'plantainroast', name: 'Plantain Roast', dishIds: ['plantain'] },
];
