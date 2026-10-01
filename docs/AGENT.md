# Chow Rush — Agent Operating Guide

> Source of truth for AI agents (OpenCode, Cursor, Copilot).
> Design: `../chow-rush-plan.md`. Progress: `PROGRESS.md`. Prompts: `prompts/1A-*.md` … `1J-*.md`.
> If conflict: `chow-rush-plan.md` > `AGENT.md` > prompt file. Ask human before deviating.

## 1. Project snapshot

- Game: Lagos food-delivery arcade, 3-lane linear scroller (Subway-Surfers style), bike stays near `z=0`, world scrolls.
- Stack: TypeScript strict + Three.js r160+ + Vite + HTML/CSS HUD + WebAudio MVP beeps (Howler Phase 2) + Firebase Phase 2 + Vercel.
- Style MVP: stylized low-poly (Quaternius/Kenney/Poly Pizza). No photoreal PBR in MVP.
- Collision: custom arcade AABB + lane/trackDistance. No Cannon/Rapier.
- Core model: everything gameplay uses `trackDistance` (meters travelled) + `laneIndex`. No static world `{x,z}` spawns.

## 2. Roles

| Role | Who | Does |
|------|-----|------|
| Architect | human | design, tech choices, approve |
| Implementer | OpenCode | write code from `prompts/*.md`, fix bugs |
| Reviewer | human | feel, visuals, approve |
| QA | OpenCode | `npm run build`, `type-check`, console check, FPS check |

## 3. Mandatory rules (reject PR if violated)

1. No file >200 lines (`src/main.ts` <50). Split before proceeding.
2. Naming: `PascalCase.ts` classes, `camelCase.ts` data/config, lowercase `types/*.ts`.
3. No magic numbers — use `src/data/*Config.ts` + `economy.ts`.
4. No physics imports. Collision only via `src/gameplay/Collision.ts:inZone()`.
5. Straight segments only. No curves/intersections.
6. Spawns via `trackDistance + offset`, never static positions.
7. Heat fractions: `hot >0.66`, `warm 0.33–0.66`, `cold <=0.33`. Tip `1.0/0.5/0.0`.
8. HUD IDs must match `index.html` ↔ `hudConfig.ts`: `#hud-cash #hud-heat #hud-rating #hud-time #menu #results #touch-controls`.
9. Pure modules stay pure: `HeatMeter`, `Collision`, `economy`, `hudConfig`, `types/*` — no Three.js / DOM imports where forbidden.
10. `dt` clamped `<=0.05`. `Game.update()` only when `PLAYING`.
11. ES modules only. `strict:true`, `moduleResolution:bundler`.
12. MVP silent except WebAudio osc beeps. No licensed Afrobeats. No ads/IAP SDKs in Phase 1–2.

## 4. Frozen paths

```
src/core/Engine.ts GameLoop.ts Camera.ts Game.ts GameState.ts
src/systems/Input.ts TouchInput.ts
src/player/Bike.ts BikeController.ts
src/world/Road.ts Building.ts CityScroller.ts
src/gameplay/Order.ts DeliveryManager.ts HeatMeter.ts Collision.ts
src/ui/HUD.ts hudConfig.ts Menu.ts Leaderboard.ts
src/data/bikeConfig.ts cityConfig.ts dishes.ts restaurants.ts economy.ts zones.ts upgrades.ts
src/types/game.ts input.ts player.ts world.ts
```

Do not invent `Controls.ts Physics.ts City.ts Zone.ts Delivery.ts Scene.ts constants.ts`.

## 5. Economy (from `economy.ts`)

`SHIFT_TIME=150 TIME_BONUS=15 MAX_TIME=180 XP_HOT=100 XP_WARM=60 XP_COLD=20 RATING_COLD=-0.5 RATING_CRASH=-1.0 RATING_HOT=+0.1 TIP_BASE=200 STREAK_BONUS=100 LEVELS={2:300,3:800,5:2000,10:8000,15:20000,20:40000}`

## 6. Camera / quality

- FOV 60 desktop, 68 portrait mobile. Offset: +10 behind, +5 up, look 10 ahead. Lerp `5.0*dt`.
- Tiers: High (PCFSoft 2048 + bloom/vignette, PR<=2), Medium (shadows 1024/off + vignette, PR<=1.5), Low (all off, PR=1). Auto-Low if FPS<25 for 3s.

## 7. Workflow per task

```
1. Read chow-rush-plan.md section + docs/prompts/<phase>.md + PROGRESS.md
2. Implement exactly the Files listed — no extra features
3. Run: npm install (first time) && npm run type-check && npm run build
4. Manual browser check per prompt Verify steps
5. Self-review with Review checklist in prompt file
6. Update PROGRESS.md (status, files, notes)
7. Stop — wait for human "approved, proceed to X"
```

Commit style: `feat(1D): city scroller straight segments + trackDistance`.

## 8. Commands

```bash
npm install
npm run dev        # HMR, test in browser
npm run type-check # tsc --noEmit
npm run build      # must pass with 0 errors
npm run preview    # prod preview
npx vercel --prod  # Phase 4 only
```

Vite must have `assetsInclude: ['**/*.glb','**/*.gltf','**/*.ktx2']`, `server.host:true`.

## 9. Common pitfalls

- Static restaurant `{x,z}` → breaks recycled world. Always trackDistance.
- Curves/intersections → breaks 3-lane logic. Straight only.
- Bloom/SSAO on mobile → kills FPS. High-tier only.
- Licensed music → legal risk. Original loops only.
- `Game.ts` bloat → extract `UpdateSystems.ts` helper, still counts to 200-line rule.

## 10. Definition of done (every phase)

- [ ] `npm run build` passes, 0 TS errors
- [ ] No console errors
- [ ] Files <200 lines
- [ ] Browser verify steps pass
- [ ] PROGRESS.md updated
