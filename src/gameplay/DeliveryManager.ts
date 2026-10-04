import * as THREE from 'three';
import { LANES } from '../data/bikeConfig';
import { DISHES } from '../data/dishes';
import { TIP_BASE } from '../data/economy';
import { RESTAURANTS } from '../data/restaurants';
import { logEvent } from '../utils/log';
import { inZone } from './Collision';
import { Order } from './Order';

const PICKUP_AHEAD = 80;
const DROPOFF_AFTER_PICKUP = 120;
const ZONE_GRACE = 10;

export type DeliveryEvent = 'picked' | 'delivered' | 'missed' | null;

export interface DeliveryResult {
  event: DeliveryEvent;
  payout: number;
}

export class DeliveryManager {
  private current: Order | null = null;
  private spawnCount = 0;
  private hintShown = false;
  private readonly pickupMarker: THREE.Mesh;
  private readonly dropoffMarker: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.pickupMarker = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0xffd23f }),
    );
    this.dropoffMarker = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x3ddc84 }),
    );
    this.pickupMarker.position.y = 1;
    this.dropoffMarker.position.y = 1;
    this.pickupMarker.visible = false;
    this.dropoffMarker.visible = false;
    scene.add(this.pickupMarker, this.dropoffMarker);
  }

  getCurrentOrder(): Order | null {
    return this.current;
  }

  spawnOrder(now: number): Order {
    const dish = DISHES[Math.floor(Math.random() * DISHES.length)];
    const spots = RESTAURANTS.filter((r) => r.dishIds.includes(dish.id));
    const restaurant = spots[Math.floor(Math.random() * spots.length)];
    const pickupDistance = now + PICKUP_AHEAD;
    const order = new Order(
      `o${++this.spawnCount}`,
      dish,
      restaurant,
      pickupDistance,
      pickupDistance + DROPOFF_AFTER_PICKUP,
      Math.floor(Math.random() * LANES.length),
    );
    this.current = order;
    logEvent('order', 'spawned', {
      id: order.id,
      dish: dish.name,
      base: dish.basePrice,
      pickup: pickupDistance,
      drop: order.dropoffDistance,
      lane: order.lane,
    });
    return order;
  }

  update(
    bikeLane: number,
    trackDist: number,
    heatMult = 1,
    streakBonus = 0,
    confirm = false,
  ): DeliveryResult {
    if (!this.current) this.spawnOrder(trackDist);
    const order = this.current as Order;

    if (
      order.getState() !== 'delivering' &&
      trackDist > order.pickupDistance + ZONE_GRACE
    ) {
      this.current = null;
      logEvent('order', 'missed pickup — new order dispatched', { id: order.id });
      return { event: 'missed', payout: 0 };
    }
    if (
      order.getState() === 'delivering' &&
      trackDist > order.dropoffDistance + ZONE_GRACE
    ) {
      this.current = null;
      logEvent('order', 'missed dropoff — customer cancelled', { id: order.id });
      return { event: 'missed', payout: 0 };
    }

    const pickupAhead = order.pickupDistance - trackDist;
    this.pickupMarker.visible = order.getState() !== 'delivering';
    this.pickupMarker.position.set(LANES[order.lane], 1, -pickupAhead);

    const dropAhead = order.dropoffDistance - trackDist;
    this.dropoffMarker.visible = order.getState() === 'delivering';
    this.dropoffMarker.position.set(LANES[order.lane], 1, -dropAhead);

    const inPickup = inZone(bikeLane, trackDist, order.lane, order.pickupDistance);
    const inDrop = inZone(bikeLane, trackDist, order.lane, order.dropoffDistance);

    if (order.getState() !== 'delivering' && inPickup && !this.hintShown) {
      this.hintShown = true;
      logEvent('order', 'at pickup — press Go (E)', { id: order.id });
    }
    if (order.getState() === 'delivering' && inDrop && !this.hintShown) {
      this.hintShown = true;
      logEvent('order', 'at dropoff — press Go (E)', { id: order.id });
    }
    if (!inPickup && !inDrop) this.hintShown = false;

    if (order.getState() !== 'delivering' && inPickup && confirm) {
      order.setState('delivering');
      logEvent('order', 'picked up', {
        id: order.id,
        dish: order.dish.name,
        cap: order.dish.heatCapacity,
      });
      return { event: 'picked', payout: 0 };
    }

    if (order.getState() === 'delivering' && inDrop && confirm) {
      order.setState('delivered');
      const tip = Math.round(Math.random() * TIP_BASE * heatMult);
      const payout = order.dish.basePrice + tip + streakBonus;
      this.current = null;
      this.pickupMarker.visible = false;
      this.dropoffMarker.visible = false;
      return { event: 'delivered', payout };
    }

    return { event: null, payout: 0 };
  }
}
