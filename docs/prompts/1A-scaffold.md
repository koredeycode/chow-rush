# 1A — Project Scaffold (detailed)

> Depends on: none. Next: 1B. Tracker: update `PROGRESS.md` 1A row when done.

## Goal

Bootable Vite+TS+Three.js app with HUD skeleton, quality tiers, economy constants. No gameplay yet.

## Context

- Read: `chow-rush-plan.md` Tech Stack / Graphics / File Org, `docs/AGENT.md` §3–8.
- Style: low-poly MVP. No physics lib. ES modules, `strict:true`.

## Files to create (exact)

1. `package.json` — scripts `dev type-check build preview`, deps `three vite typescript @types/three`. No cannon/rapier/howler.
2. `tsconfig.json` — `strict:true, module:ESNext, target:ES2020, lib:[DOM DOM.Iterable ESNext], moduleResolution:bundler, skipLibCheck:true`.
3. `vite.config.js` — `assetsInclude:['**/*.glb','**/*.gltf','**/*.ktx2']`, `server.host:true`.
4. `index.html` — `#game-canvas`, `#ui-overlay` containing `#hud>(#hud-cash #hud-heat #hud-rating #hud-time)`, `#menu #results #touch-controls`.
5. `src/main.ts` (<50 lines) — create `Engine`, test cube, start loop. No game logic.
6. `src/core/Engine.ts` — `WebGLRenderer(antialias)`, `Scene(fog)`, `PerspectiveCamera(FOV 60 / 68 portrait)`, `resize()`, `setQualityTier(high|medium|low)` (shadowmap size, pixelRatio), `render()`.
7. `src/core/GameLoop.ts` — `onUpdate(dt), onRender()` callbacks, `requestAnimationFrame`, `dt=min(0.05,(now-last)/1000)`.
8. `src/style.css` — reset, fullscreen canvas, overlay pointer-events none except buttons.
9. `src/data/economy.ts` — export `SHIFT_TIME=150 TIME_BONUS=15 MAX_TIME=180 XP_HOT=100 XP_WARM=60 XP_COLD=20 RATING_COLD=-0.5 RATING_CRASH=-1.0 RATING_HOT=0.1 TIP_BASE=200 STREAK_BONUS=100 LEVELS={2:300,3:800,5:2000,10:8000,15:20000,20:40000}`.

## Steps

1. `npm create vite` equivalent files by hand (do not eject).
2. Wire `main.ts → Engine + GameLoop` with spinning cube to prove render.
3. Verify HUD IDs exactly — 1H depends on them.

## Constraints

- Each file <200 lines. Engine = renderer/scene/camera only. GameLoop = loop only.
- FOV logic in Engine, not Camera (Camera comes in 1E).

## Verify

```bash
npm install && npm run type-check && npm run build && npm run dev
```

Browser: cube renders, resize works, zero console errors, no 404 for HUD IDs.

## Review checklist

- [ ] strict:true, bundler resolution
- [ ] all HUD IDs present
- [ ] `setQualityTier` exists, dt clamp 0.05
- [ ] economy exports all constants
- [ ] no physics deps
- [ ] build 0 errors

If clean: mark `PROGRESS.md` 1A `[x]`, await “Scaffold approved, proceed to 1B.”
