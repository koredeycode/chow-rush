# Chow Rush — Progress Tracker

> Updated by agent after every phase. Human flips `Pending → Approved`.
> Specs: `docs/prompts/1A-*.md` … `1J-*.md`. Rules: `docs/AGENT.md`.

Status legend: `[ ] Pending` `[~] In progress` `[x] Done, awaiting review` `[✓] Approved`

## Phase 1 — MVP

| Phase | Prompt file | Files | Acceptance | Status | Notes |
|-------|-------------|-------|------------|--------|-------|
| 1A Scaffold | `prompts/1A-scaffold.md` | package, tsconfig, vite.config, index.html (HUD skeleton), main.ts, Engine.ts, GameLoop.ts, style.css, economy.ts | dev starts, build passes, HUD IDs present, quality tiers exist | [x] Done, awaiting review | build 0 errors, cube renders, all IDs present; review fix: shadow 2048/1024 + .gitkeep |
| 1B Input | `prompts/1B-input.md` | types/input.ts, systems/Input.ts, systems/TouchInput.ts | keyboard+touch same interface, merged getInput | [x] Done, awaiting review | Keyboard+Touch swappable, OR-merge, blur clears, build 0 errors |
| 1C Bike | `prompts/1C-bike.md` | data/bikeConfig.ts, player/Bike.ts, player/BikeController.ts | lane switch, accel/brake clamp | [x] Done, awaiting review | edge-trigger lanes + cooldown, clamps OK, build 0 errors |
| 1D City | `prompts/1D-city.md` | data/cityConfig.ts, world/Road.ts, world/Building.ts, world/CityScroller.ts | straight scroll, recycle, trackDistance | [x] Done, awaiting review | pooled segments, COUNT*LEN recycle, build 0 errors |
| 1E Camera | `prompts/1E-camera.md` | core/Camera.ts | smooth follow, FOV 60/68 | [x] Done, awaiting review | exp damping 5.0, look-ahead 10, build 0 errors |
| 1F Delivery | `prompts/1F-delivery.md` | data/dishes.ts, data/restaurants.ts, gameplay/Order.ts, gameplay/Collision.ts, gameplay/DeliveryManager.ts | track-distance spawn +80/+120, inZone detect, payout | [x] Done, awaiting review | one order at a time, markers, TIP_BASE payout, build 0 errors |
| 1G Heat | `prompts/1G-heat.md` | gameplay/HeatMeter.ts | drain linear, 0.66/0.33, tip 1/0.5/0 | [x] Done, awaiting review | pure logic, sanity t0/t12/t22 pass, build 0 errors |
| 1H HUD | `prompts/1H-hud.md` | ui/hudConfig.ts, ui/HUD.ts | ₦/ % / rating / m:ss format, read-only | [x] Done, awaiting review | formatters verified ₦12,500/75%/4.5/2:30, build 0 errors |
| 1I State | `prompts/1I-gamestate.md` | core/GameState.ts, core/Game.ts | MENU/PLAYING/PAUSED/RESULTS, timer/crash end, localStorage | [x] Done, awaiting review | composition root, start resets, RESULTS+saveBest, 157 lines |
| 1J Integrate | `prompts/1J-integration.md` | main.ts wiring | playable loop, 60 FPS desktop | [x] Done, awaiting review | thin entry 25 lines, P/Esc pause, build 0 errors, all files <200 |

## Phase 2 — Core Game

- [ ] zones (straight + fog transitions)
- [ ] 5 restaurants track-distance
- [ ] tip/streak/rating from economy.ts
- [ ] obstacles AABB (pothole/vendor/pedestrian)
- [ ] garage + upgrades
- [ ] original audio loops + SFX
- [ ] Firebase auth + leaderboard + offline fallback

## Phase 3 — Polish

- [ ] High-tier post only
- [ ] rain/night + tires/headlight
- [ ] mobile controls
- [ ] loading + KTX2 streaming
- [ ] PWA manifest

## Phase 4 — Launch

- [ ] analytics + consent
- [ ] ads/IAP SDKs
- [ ] trailer/screenshots
- [ ] Vercel prod + env

## Log

| Date | Phase | Change |
|------|-------|--------|
| 2026-10-01 | — | Tracker created, all Pending |
| 2026-10-01 | 1A | Scaffold done: Vite+TS+Three r160, Engine/GameLoop/economy, build passes |
| 2026-10-01 | 1A | Review: Engine shadow mapSize 2048/1024 fix, public/.gitkeep added, type-check+build 0 errors |
| 2026-10-01 | 1B | Input done: Keyboard + Touch same interface, getCombinedInput OR-merge, build passes |
| 2026-10-01 | 1C | Bike done: greybox box, edge-trigger lanes + cooldown, accel/brake clamp, build passes |
| 2026-10-01 | 1D | City done: pooled straight segments, trackDistance clock, recycle COUNT*LEN, build passes |
| 2026-10-01 | 1E | Camera done: chase rig exp damping, offset 10/5, look-ahead 10, build passes |
| 2026-10-01 | 1F | Delivery done: track-distance orders, inZone checks, markers, payout, build passes |
| 2026-10-01 | 1G | Heat done: linear drain, 0.66/0.33 tiers, tip 1/0.5/0, sanity pass, build passes |
| 2026-10-01 | 1H | HUD done: read-only DOM, formatters verified, heat color tiers, build passes |
| 2026-10-01 | 1I | State done: 4-state machine, Game wires all systems, timer/crash end, localStorage best |
| 2026-10-01 | 1J | Integration done: thin main.ts, Game+loop wiring, P/Esc pause, full audit <200 lines |
| 2026-10-02 | — | Mobile feel batch (uncommitted→committed): tracking logs+vConsole replay, Stats split, hop jump, swipe lanes, WebAudio beeps |
