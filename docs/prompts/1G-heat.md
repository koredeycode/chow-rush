# 1G — Heat Meter (detailed)

Depends on: 1F. Next: 1H.

## Goal

Linear food cooling with hot/warm/cold tip tiers.

## File

- `src/gameplay/HeatMeter.ts` — `class HeatMeter {maxHeat,currentHeat; reset(cap:number){max=current=cap}; update(dt): current=max(0,current-dt); getPercent()=current/max; getState(): 'hot' if p>0.66 else 'warm' if p>0.33 else 'cold'; getTipMultiplier()=1.0/0.5/0.0 }`. No Three.js.

## Edge cases

- `reset(0)` guard → percent 0, cold.
- Pause → do not call update.
- Thermal-bag upgrade (Phase 2) multiplies cap — keep `reset(cap*mult)` hook.

## Verify

`npm run build`. Unit sanity: cap 30 → t0 hot/1.0, t12 warm/0.5, t22 cold/0.0.

## Review

- [ ] thresholds exactly 0.66/0.33
- [ ] pure, unit-testable, <200 lines

Mark PROGRESS 1G `[x]`.
