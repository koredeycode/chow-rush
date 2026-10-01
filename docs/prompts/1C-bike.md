# 1C — Player Bike Greybox (detailed)

Depends on: 1A, 1B. Next: 1D.

## Goal

Lane-based arcade bike (placeholder box) driven by `InputState`.

## Files

1. `src/data/bikeConfig.ts` — `LANES=[-3,0,3] LANE_WIDTH=3 MAX_SPEED=60 (units/s ~ display km/h x1) ACCELERATION=20 BRAKE_FORCE=30 LANE_CHANGE_COOLDOWN=0.15`.
2. `src/player/Bike.ts` — `class Bike {mesh:Mesh(BoxGeometry 1x1x2, orange); laneIndex=1; speed=0; update(dt,input): move x toward LANES[laneIndex], z stays 0; accelerate/brake clamp [0,MAX_SPEED]; getLaneX() getPosition():Vector3 }`. No input reading here.
3. `src/player/BikeController.ts` — `class BikeController {bike; cooldown; update(dt,input): edge-trigger left/right (decrement/increment clamp 0-2), hold up/down for accel/brake, expose hop/horn/action flags }`.

## Rules

- Start middle lane. Instant switch for MVP (lerp polish later in Phase 2).
- No magic numbers, no Three.js in Controller beyond types, no physics.
- Hop/horn just flags for now (obstacles use them in Phase 2).

## Verify

Build passes. Dev: arrows switch lanes, W speeds up, S brakes, box stays on road plane.

## Review

- [ ] Bike = state+mesh only, Controller = input mapping only
- [ ] clamps correct, cooldown prevents double-shift
- [ ] <200 lines

Mark PROGRESS 1C `[x]`.
