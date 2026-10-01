# 1J — Integration Test (detailed)

Depends on: 1A–1I. Next: Phase 2.

## Goal

Thin entry + full playable MVP verification.

## File

- `src/main.ts` (<50 lines) — `new Game(canvas); game.start(); resize → engine.resize(); key P/Esc → pause/resume`. No logic.

## End-to-end checklist (must all pass in browser)

1. Greybox bike on scrolling road, buildings both sides.
2. Arrows/A-D steer, W gas, S brake.
3. Camera follows smooth, no clip.
4. Order spawns ~80m ahead, pickup zone works, heat drains, deliver pays `base+tip*mult+streak`.
5. HUD live: cash/heat/rating/time.
6. P pauses, resumes. Timer end or 3 crashes → RESULTS.
7. `npm run build` 0 errors, no console errors, 60 FPS desktop, all files <200 lines.

## Review

If any fail, file bug against owning phase (e.g. zone miss → 1F, heat wrong → 1G), fix, re-run.
If all pass: PROGRESS 1J `[✓]`, declare “Phase 1 MVP approved”, proceed to Phase 2.

## Prompts index

- 1A `1A-scaffold.md` · 1B `1B-input.md` · 1C `1C-bike.md` · 1D `1D-city.md` · 1E `1E-camera.md`
- 1F `1F-delivery.md` · 1G `1G-heat.md` · 1H `1H-hud.md` · 1I `1I-gamestate.md` · 1J this file
