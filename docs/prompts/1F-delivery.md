# 1F — Delivery System, track-distance (detailed)

Depends on: 1C, 1D, economy.ts. Next: 1G.

## Goal

One active order, spawned ahead on track, pickup → deliver with arcade zone checks.

## Files

1. `src/data/dishes.ts` — `[{id:'jollof',name:'Jollof Rice',heatCapacity:30,basePrice:500},{id:'suya',...,45,300},{id:'puff',...,20,200}]`.
2. `src/data/restaurants.ts` — `[{id:'mamaput',name:'Mama Put',dishIds:['jollof','puff']}]`. No positions.
3. `src/gameplay/Order.ts` — `type OrderState='pending'|'pickup'|'delivering'|'delivered'; class Order {id,dish,restaurant,pickupDistance,dropoffDistance,lane,state}`.
4. `src/gameplay/Collision.ts` — `export function inZone(bikeLane,bikeDist,targetLane,targetDist,rLane=0.5,rDist=5):boolean` — lane equality + `abs(dist-target)<rDist`. Pure, tested.
5. `src/gameplay/DeliveryManager.ts` — `current:Order|null; spawnOrder(now): pickup=now+80, drop=pickup+120, lane=rand 0-2; update(bikeLane,trackDist): if inZone pickup → state delivering + start HeatMeter (1G hooks); if inZone drop → delivered + payout=basePrice+rand(0,TIP_BASE)*heatMult+streak; auto-spawn when null`.

## Rules

- Never static x/z. Distances only.
- Payout uses `economy.ts TIP_BASE STREAK_BONUS`.
- One order at a time.

## Verify

Build passes. Drive 80m — yellow marker (box placeholder) appears in lane, enter zone → pickup, drive 120m → deliver, cash increases.

## Review

- [ ] data pure, no logic
- [ ] inZone math correct
- [ ] spawn offsets 80/120
- [ ] <200 lines

Mark PROGRESS 1F `[x]`.
