export interface Restaurant {
  id: string;
  name: string;
  dishIds: string[];
}

export const RESTAURANTS: readonly Restaurant[] = [
  { id: 'mamaput', name: 'Mama Put', dishIds: ['jollof', 'puff'] },
];
