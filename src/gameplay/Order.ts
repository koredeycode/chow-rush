import type { Dish } from '../data/dishes';
import type { Restaurant } from '../data/restaurants';

export type OrderState = 'pending' | 'pickup' | 'delivering' | 'delivered';

export class Order {
  constructor(
    readonly id: string,
    readonly dish: Dish,
    readonly restaurant: Restaurant,
    readonly pickupDistance: number,
    readonly dropoffDistance: number,
    readonly lane: number,
    private state: OrderState = 'pending',
  ) {}

  getState(): OrderState {
    return this.state;
  }

  setState(state: OrderState): void {
    this.state = state;
  }
}
