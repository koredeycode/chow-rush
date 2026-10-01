# 1I — Game State Machine (detailed)

Depends on: 1A–1H. Next: 1J.

## Goal

Composition root wiring all systems + shift lifecycle.

## Files

1. `src/core/GameState.ts` — `enum GameState {MENU,PLAYING,PAUSED,RESULTS}; class State {current; setState(); isPlaying(); }` + `loadBest()/saveBest()` localStorage (`chowrush_best`).
2. `src/core/Game.ts` (<200 lines, split to `UpdateSystems.ts` if needed) — owns engine/camera/bike/controller/scroller/delivery/heat/hud/input + `stats{cash,xp,rating,timeLeft,streak,crashes}`; `start(): reset stats (cash 0 rating 5.0 time SHIFT_TIME) + spawn first order; pause()/resume(); update(dt): if !PLAYING return; dt clamp; trackDistance via scroller, timeLeft-=dt, heat.update, delivery.update, collision/crash → crashes++, rating+=RATING_CRASH, streak reset; hot deliver → cash+=payout xp+=XP time+=TIME_BONUS rating+=0.1; end if time<=0||crashes>=3 → RESULTS + saveBest`.

## Rules

- No road/building math inside Game — delegate.
- No circular imports. No Firestore in Phase 1.
- Rating clamp 1.0–5.0, time clamp MAX_TIME.

## Verify

Build passes. Start → timer ticks, pause freezes, resume continues, timeout/crash×3 → RESULTS with best saved.

## Review

- [ ] 4 states, update only PLAYING
- [ ] start resets all, <200 lines
- [ ] no cycles

Mark PROGRESS 1I `[x]`.
