import { LANE_CHANGE_COOLDOWN } from '../data/bikeConfig';
import type { InputState } from '../types/input';
import type { Bike } from './Bike';

export class BikeController {
  hop = false;
  horn = false;
  action = false;
  private cooldown = 0;
  private prevLeft = false;
  private prevRight = false;
  private prevHop = false;

  constructor(private readonly bike: Bike) {}

  update(dt: number, input: InputState): void {
    this.cooldown = Math.max(0, this.cooldown - dt);

    const leftEdge = input.left && !this.prevLeft;
    const rightEdge = input.right && !this.prevRight;
    const hopEdge = input.hop && !this.prevHop;
    this.prevLeft = input.left;
    this.prevRight = input.right;
    this.prevHop = input.hop;

    if (this.cooldown <= 0) {
      if (leftEdge) {
        this.bike.setLane(this.bike.laneIndex - 1);
        this.cooldown = LANE_CHANGE_COOLDOWN;
      } else if (rightEdge) {
        this.bike.setLane(this.bike.laneIndex + 1);
        this.cooldown = LANE_CHANGE_COOLDOWN;
      }
    }

    if (input.up) this.bike.accelerate(dt);
    if (input.down) this.bike.brake(dt);
    if (hopEdge) this.bike.hop();

    this.hop = input.hop;
    this.horn = input.horn;
    this.action = input.action;

    this.bike.update(dt);
  }
}
