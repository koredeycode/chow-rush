# Chow Rush — Browser Game Design Document

## Overview

**Chow Rush** is a browser-based food delivery arcade game set in Lagos, Nigeria. You play as a delivery rider working for Mama Put, picking up local dishes and delivering them across the city before the food gets cold.

**Platform:** Browser (desktop + mobile)
**Engine:** Three.js (WebGL) for 3D realistic graphics
**Language:** TypeScript
**Style:** High-quality 3D graphics matching real-life objects — real buildings, vehicles, food, street scenes

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **3D Engine** | Three.js (r160+) | Best WebGL library, huge ecosystem, runs everywhere |
| **Renderer** | WebGL 2.0 | Hardware-accelerated, realistic lighting/shadows |
| **Collision** | Custom arcade (AABB + lane / distance checks) | No physics engine for MVP — lane-based movement needs only zone/distance tests; revisit Rapier only if crash ragdoll needed |
| **Build Tool** | Vite | Fast dev server, instant HMR, easy deploy |
| **Language** | TypeScript | Type safety, better IDE support, fewer runtime bugs |
| **UI** | HTML/CSS overlay | HUD, menus, leaderboards on top of 3D canvas |
| **Audio** | Howler.js | Positional audio, radio stations, SFX |
| **Backend** | Firebase (Auth, Firestore, Analytics) | Real-time DB, auth, hosting-free backend, free tier |
| **Hosting** | Vercel | Free tier, CDN, instant deploy, Git integration |
| **Assets** | See Asset Sources below | High-quality 3D models (CC0/CC-BY) |

---

## Graphics Approach — Stylized Low-Poly Lagos (MVP)

### Art Direction
- **Stylized low-poly 3D for MVP** — matches CC0 sources (Quaternius / Kenney / Poly Pizza). Simple shapes, flat / low-texture PBR, consistent proportions. Photorealistic PBR deferred to Phase 3.
- **Lagos street aesthetic** — danfos, okadas, street vendors, billboards, power lines, dirt roads with tarmac patches
- **Stylized food models** — jollof rice in a foil pack, suya on skewers, puff puff in a bowl, amala in a plate (low-poly + vertex colors for MVP; realistic replacements require custom modeling — no CC0 danfo/keke/jollof exists)
- **Stylized buildings** — Nigerian architecture: bungalows, duplexes, shops with corrugated iron roofs, malls (Shoprite-style)
- **Stylized vehicles** — danfo buses, okada motorcycles, keke napep, delivery bikes with thermal bags

### Rendering Pipeline
```
MVP (stylized low-poly):
├── MeshStandardMaterial / MeshLambertMaterial + vertex colors
├── 1x directional light + hemisphere light (Lagos sky)
├── Real-time shadows (PCFSoftShadowMap, desktop only)
├── Environment lighting (low-res HDR skybox from Poly Haven)
├── Fog (atmospheric depth)
└── No post-processing on MVP mobile

Phase 3 only (photoreal upgrade path):
├── PBR albedo / normal / roughness maps
├── Baked AO (no realtime SSAO on mobile)
└── Post-processing (bloom, vignette, color grading — desktop High tier only)
```

### Camera Defaults
- **FOV:** 60 (desktop), 65-70 (portrait mobile for wider road view)
- See `src/core/Camera.ts` spec in 1E for offset / look-ahead.

### Performance Targets + Quality Tiers
| Metric | Target |
|--------|--------|
| **FPS** | 60 on desktop, 30+ on mobile |
| **Draw calls** | < 200 per frame |
| **Triangle count** | < 500K per scene |
| **Texture memory** | < 256 MB |
| **Load time** | < 5 seconds (with loading screen) |

| Tier | Shadows | Post | PixelRatio | Notes |
|------|---------|------|------------|-------|
| High (desktop) | PCFSoft 2048 | bloom + vignette | min(devicePixelRatio, 2) | Default on desktop |
| Medium (high-end mobile) | 1024 or off | vignette only | min(devicePixelRatio, 1.5) | Default if mobile + WebGL2 |
| Low (low-end mobile) | off | off | 1.0 | Auto if FPS < 25 for 3s |

### Optimization Strategies
- **LOD (Level of Detail)** — 3 models per asset (near, mid, far)
- **Instancing** — repeated objects (street lights, power poles, trees)
- **Texture atlasing** — combine small textures into one atlas
- **Frustum culling** — Three.js built-in (do not re-implement; this covers behind-camera)
- **No realtime occlusion culling for MVP** — portals/BVH out of scope; rely on frustum culling + segment recycling + fog
- **Compressed textures** — KTX2 / Basis Universal
- **Asset streaming** — load zone assets as player progresses

---

## Asset Sources

### 3D Models — MVP uses low-poly only

> MVP rule: use Quaternius / Kenney / Poly Pizza low-poly for everything. Sketchfab / CGTrader realistic models are Phase 3 candidates only — they clash in style, vary in license/quality, and will not contain danfo / keke / jollof without custom modeling.

| Site | URL | License | Content | Notes |
|------|-----|---------|---------|-------|
| **Quaternius** | https://quaternius.com | CC0 | Low-poly vehicles, buildings, characters, props | MVP default — game-ready, animated options |
| **Poly Pizza** | https://poly.pizza | CC0 | 10,700+ low-poly models, food, furniture, vehicles | MVP default — no login, great props |
| **Kenney** | https://kenney.nl/assets | CC0 | Game assets, vehicles, buildings, food, UI | MVP default — consistent style |
| **Poly Haven** | https://polyhaven.com | CC0 | HDRIs, textures, models | HDR skyboxes only for MVP |
| **Sketchfab (Phase 3)** | https://sketchfab.com | CC-BY / CC0 (filter) | Realistic vehicles, buildings, food | Filter Downloadable + license; style clash risk |
| **CGTrader (Phase 3)** | https://www.cgtrader.com/free-3d-models | Free section | Realistic vehicles, props | Quality varies, check license; Phase 3 only |

### Textures & Materials (Phase 3 — MVP uses vertex colors + 1 atlas)

| Site | URL | License | Content |
|------|-----|---------|---------|
| **Poly Haven** | https://polyhaven.com/textures | CC0 | PBR textures, HDRIs (skybox only for MVP) |
| **AmbientCG** | https://ambientcg.com | CC0 | PBR materials (Phase 3) |

### Audio — original loops only for music

| Site | URL | License | Content |
|------|-----|---------|---------|
| **Freesound** | https://freesound.org | CC0 / CC-BY | SFX, ambient, vehicle sounds (verify each license, credit CC-BY) |
| **Zapsplat** | https://www.zapsplat.com | Free w/ attribution | SFX, UI, vehicle (attribution required) |
| **Mixkit / Pixabay (SFX only)** | https://mixkit.co / https://pixabay.com/music | Free | SFX only — do NOT use as Afrobeats radio; music must be original loops to avoid licensing |

### Specific Assets to Source (MVP low-poly placeholders)

| Asset | Search Terms | Preferred Source |
|-------|--------------|------------------|
| Delivery bike (Honda) | "motorcycle," "bike," "honda" | Quaternius, Sketchfab |
| Thermal delivery bag | "delivery box," "thermal bag," "backpack" | Poly Pizza, Kenney |
| Danfo bus | "bus," "minibus," "van" | Quaternius, Sketchfab |
| Okada motorcycle | "motorcycle," "scooter," "moped" | Quaternius, Poly Pizza |
| Keke napep (tricycle) | "tricycle," "rickshaw," "tuk tuk" | Sketchfab, CGTrader |
| Jollof rice | "rice," "food," "african food" | Poly Pizza, Sketchfab |
| Suya skewers | "skewer," "kebab," "food" | Poly Pizza, Kenney |
| Puff puff | "food," "fried dough," "bowl" | Poly Pizza, Kenney |
| Amala & Ewedu | "food," "african food," "soup" | Sketchfab, CGTrader |
| Lagos buildings | "building," "house," "shop," "african" | Quaternius, Kenney |
| Street vendor stall | "stall," "market," "vendor," "stand" | Poly Pizza, Kenney |
| Pothole / road damage | "road," "pothole," "damage" | AmbientCG (textures) |
| Police checkpoint | "barrier," "checkpoint," "police" | Kenney, Poly Pizza |
| Street lights | "street light," "lamp," "pole" | Quaternius, Kenney |
| Power lines / poles | "power line," "electric pole," "utility" | Quaternius, Kenney |
| Billboards | "billboard," "sign," "advertisement" | Kenney, Poly Pizza |
| Pedestrian characters | "character," "person," "people" | Quaternius, Kenney |
| Rain particle effect | "rain," "particles," "weather" | Three.js examples |

---

## Agentic Development Flow

### Overview

This project uses an **agentic AI-assisted development workflow** — leveraging AI coding agents to accelerate development while maintaining human oversight for creative and architectural decisions.

### Tools & Setup

| Tool | Purpose | Config |
|------|---------|--------|
| **OpenCode** | Primary AI coding agent + orchestration | This is what you're using right now |
| **Cursor** (optional) | AI-powered IDE for manual edits | Composer mode for multi-file edits |
| **GitHub Copilot** (optional) | Inline suggestions, chat | VS Code / Cursor extension |

### Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTIC DEV FLOW (OpenCode)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PLAN                                                    │
│     └── Write/update design doc (this file)                 │
│     └── Detailed specs live in docs/prompts/1A…1J.md       │
│     └── Track in docs/PROGRESS.md, rules in docs/AGENT.md   │
│                                                             │
│  2. GENERATE                                                │
│     └── OpenCode implements ONE prompt file at a time      │
│     └── You review diff, request changes                    │
│     └── Iterate until acceptance criteria met               │
│                                                             │
│  3. TEST                                                    │
│     └── Run dev server, verify in browser                   │
│     └── OpenCode fixes bugs from error logs                 │
│     └── You verify feel and visuals                         │
│                                                             │
│  4. COMMIT                                                  │
│     └── OpenCode writes commit message                      │
│     └── You approve and push                                │
│                                                             │
│  5. DEPLOY                                                  │
│     └── Vercel auto-deploys from Git                        │
│     └── Verify production build                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Agent Roles

| Role | Agent | Responsibility |
|------|-------|----------------|
| **Architect** | Human (you) | System design, tech choices, code review |
| **Implementer** | OpenCode | Write code from specs, fix bugs |
| **Reviewer** | Human (you) | Visual quality, gameplay feel, approve PRs |
| **QA** | OpenCode | Run tests, check console errors, verify build |

### Prompt Templates

#### Feature Implementation
```
Implement [feature name] in the Chow Rush game.

Context:
- Project: Three.js + TypeScript + Vite browser game
- File structure: [relevant files]
- Design doc: chow-rush-plan.md

Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

Acceptance Criteria:
- [ ] Feature works in browser
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Matches design doc spec
- [ ] Performance target: 60 FPS

Please implement and verify the build passes.
```

#### Bug Fix
```
Fix the following bug in Chow Rush:

Error: [error message]
File: [file name]
Context: [what were you doing when it happened]

Please:
1. Identify root cause
2. Fix the issue
3. Verify build passes
4. Explain the fix
```

#### Code Review
```
Review the following changes in Chow Rush:

Focus areas:
- TypeScript type safety
- Three.js best practices
- Performance (draw calls, memory, GC)
- Code organization and naming

Changes: [git diff or file list]

Please provide:
- Issues found (with severity)
- Suggestions for improvement
- Approval or request changes
```

### OpenCode Tips

- **Be specific** — "Add a pothole obstacle that slows the player" works better than "add obstacles"
- **Reference the design doc** — point to sections of this file for context
- **Iterate in small steps** — one feature at a time, verify, then move on
- **Use the browser** — OpenCode can open a preview tab to test the game visually
- **Commit often** — small, focused commits make it easy to review and revert
- **Leverage subagents** — spawn explore agents to find assets or research solutions

### File Organization for Agentic Dev (frozen — Phase 1 uses this exactly)

> Naming convention: `PascalCase.ts` for classes (`Bike.ts`, `Game.ts`, `HUD.ts`), `camelCase.ts` for pure data/config (`bikeConfig.ts`, `dishes.ts`, `hudConfig.ts`), lowercase for `types/*.ts`. `src/systems/` for input, `src/player/` for bike, `src/world/` for road/city, `src/gameplay/` for orders/heat. Do not use `Controls.ts` / `Physics.ts` / `City.ts` / `Zone.ts` / `Delivery.ts` names — superseded below.
> Docs contract: `docs/AGENT.md` = agent rules, `docs/PROGRESS.md` = tracker, `docs/prompts/*.md` = executable per-phase specs (detailed). This plan stays the source of truth; prompts expand it.

```
chow-rush/
├── docs/
│   ├── AGENT.md               # agent operating guide (rules, workflow, pitfalls)
│   ├── PROGRESS.md            # phase tracker — update after every phase
│   └── prompts/               # detailed executable specs (use these, in order)
│       ├── README.md          # index + execution order
│       ├── 1A-scaffold.md
│       ├── 1B-input.md
│       ├── 1C-bike.md
│       ├── 1D-city.md
│       ├── 1E-camera.md
│       ├── 1F-delivery.md
│       ├── 1G-heat.md
│       ├── 1H-hud.md
│       ├── 1I-gamestate.md
│       └── 1J-integration.md
├── src/
│   ├── core/                  # Engine, loop, camera, state
│   │   ├── Engine.ts
│   │   ├── GameLoop.ts
│   │   ├── Camera.ts
│   │   ├── Game.ts
│   │   └── GameState.ts
│   ├── systems/               # Input only
│   │   ├── Input.ts
│   │   └── TouchInput.ts
│   ├── player/                # Bike only (no Physics.ts — arcade movement)
│   │   ├── Bike.ts
│   │   └── BikeController.ts
│   ├── world/                 # Road + city scroller (straight segments only)
│   │   ├── Road.ts
│   │   ├── Building.ts
│   │   └── CityScroller.ts
│   ├── gameplay/              # Delivery, orders, heat, collision
│   │   ├── Order.ts
│   │   ├── DeliveryManager.ts
│   │   ├── HeatMeter.ts
│   │   └── Collision.ts
│   ├── ui/                    # HUD, menus
│   │   ├── HUD.ts
│   │   ├── hudConfig.ts
│   │   ├── Menu.ts
│   │   └── Leaderboard.ts
│   ├── audio/                 # Music, SFX (Phase 2)
│   │   ├── AudioManager.ts
│   │   └── Radio.ts
│   ├── data/                  # Config, balance, content (no logic)
│   │   ├── bikeConfig.ts
│   │   ├── cityConfig.ts
│   │   ├── dishes.ts
│   │   ├── restaurants.ts
│   │   ├── economy.ts
│   │   ├── zones.ts
│   │   └── upgrades.ts
│   ├── firebase/              # Backend integration (Phase 2)
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── analytics.ts
│   ├── utils/                 # Helpers
│   │   ├── math.ts
│   │   ├── random.ts
│   │   └── pool.ts
│   ├── types/                 # TypeScript types (lowercase)
│   │   ├── game.ts
│   │   ├── input.ts
│   │   ├── player.ts
│   │   └── world.ts
│   ├── main.ts                # Entry point (<50 lines)
│   └── style.css              # UI styles
├── public/
│   ├── models/                # .glb, .gltf files
│   ├── textures/              # .jpg, .png, .ktx2
│   ├── audio/                 # .mp3, .ogg
│   └── icons/                 # UI icons
├── index.html                 # must include HUD skeleton (see 1A)
├── package.json
├── tsconfig.json
├── vite.config.js
├── .env                       # Firebase config (gitignored, mirror in Vercel env)
├── .env.example               # Template for env vars
└── vercel.json                # Vercel config
```

### Development Commands

```bash
# Install dependencies
npm install

# Dev server with HMR
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
npx vercel --prod
```

### Firebase Setup

```typescript
// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
```

### Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Game Structure

### Scenes
| Scene | Purpose |
|-------|---------|
| **Main Menu** | Title, play button, garage, leaderboard, settings |
| **Garage** | Bike selection, upgrades, customization |
| **Game** | Core gameplay — 3D city, driving, deliveries |
| **Results** | Score breakdown, earnings, rating, next shift |
| **Leaderboard** | Global rankings, friends, weekly challenges |

### Game Flow
```
Main Menu → Select Shift → Countdown → Drive & Deliver → Results → Garage → Repeat
```

---

## Core Gameplay

### Controls
| Input | Action |
|-------|--------|
| **← / →** or **A / D** | Change lane / steer |
| **↑** or **W** | Accelerate |
| **↓** or **S** | Brake |
| **Space** | Hop / jump |
| **H** | Horn (clears pedestrians) |
| **E** | Pick up / deliver (when in zone) |
| **Mobile** | Touch: left/right halves to steer, tap buttons for gas/brake/hop |

### Delivery Loop
1. **Order notification** — customer name, dish, restaurant, destination, payout
2. **Navigate to restaurant** — GPS-style arrow points the way
3. **Pickup** — stop in yellow zone, wait 1–2 sec, food appears on bike
4. **Deliver** — follow arrow to customer, stop in zone, tap E
5. **Get paid** — base fare + tip (based on speed + food temperature) + streak bonus

### Heat Meter
- Each dish has a **heat capacity** (how long it stays hot)
- Heat drains over time while carrying
- Thresholds (fraction of max): `hot = heat > 0.66`, `warm = 0.33 < heat <= 0.66`, `cold = heat <= 0.33`
- Tip multiplier: hot = 1.0, warm = 0.5, cold = 0.0
- Deliver lukewarm → half tip; deliver cold → no tip, rating -0.5

| Dish | Heat Capacity | Notes |
|------|---------------|-------|
| Jollof Rice | 30 sec | Standard |
| Suya | 45 sec | Stays hot longer (smoky) |
| Puff Puff | 20 sec | Cools fast |
| Amala & Ewedu | 25 sec | Medium |
| Roasted Plantain | 35 sec | Medium-long |

### Obstacles (MVP: pothole + vendor only; rest Phase 2)
| Obstacle | Effect | Counter | Phase |
|----------|--------|---------|-------|
| Pothole | Slow to 50% for 2s | Hop over (Space) | MVP |
| Street vendor | Block lane (AABB) | Honk or dodge | MVP |
| Pedestrian | Crash if hit (AABB) | Horn or dodge | MVP (simple stop, no ragdoll) |
| Police checkpoint | Lose cash or time | Bribe or detour | Phase 2 |
| Traffic jam | Forced slow | Wait or lane change | Phase 2 |
| Rain | Reduced grip, slower | Drive carefully | Phase 2 |

### Collision (arcade, no physics engine)
- All hits are AABB / lane + `trackDistance` checks in `src/gameplay/Collision.ts`.
- Crash = speed set to 0 for 1s + screen shake, no tumbling. 3 crashes = shift ends.

### Rating, Timer, Payout (see `src/data/economy.ts`)
- **Shift timer:** 150s (shows as `2:30`). +15s per successful delivery, max 180s.
- **Rating:** starts 5.0, -0.5 cold delivery, -1.0 crash into pedestrian, +0.1 hot delivery (clamp 1.0-5.0).
- **Payout:** `basePrice + tip*heatMultiplier + streakBonus`. Streak +100 per consecutive hot delivery, reset on cold/crash. See 1F + economy.ts.

---

## Progression + Economy (tuned in `src/data/economy.ts`)

### Player Level
- XP: hot delivery = 100, warm = 60, cold = 20. Level thresholds: L2=300, L3=800, L5=2000, L10=8000, L15=20000, L20=40000.
- Level up → unlock new zones, restaurants, bike tiers
- Persist locally in `localStorage` for MVP; Firestore sync in Phase 2.

### Bike Tiers
| Tier | Name | Top Speed | Unlock |
|------|------|-----------|--------|
| 1 | Old Honda | 60 km/h | Start |
| 2 | New Honda | 75 km/h | Level 5 |
| 3 | TVS King | 90 km/h | Level 10 |
| 4 | Electric Bike | 100 km/h | Level 15 |
| 5 | Mama Put Pro | 120 km/h | Level 20 |

### Upgrades
| Upgrade | Effect | Cost |
|---------|--------|------|
| Engine | +Top speed | ₦5,000 |
| Thermal bag | +Heat capacity | ₦3,000 |
| Horn | +Clear radius | ₦2,000 |
| Headlight | +Night visibility | ₦1,500 |
| Tires | +Grip in rain | ₦4,000 |

### Zones
| Zone | Traffic | Weather | Unlock |
|------|---------|---------|--------|
| Yaba | Light | Clear | Start |
| Ojuelegba | Medium | Clear | Level 3 |
| Ikeja | Heavy | Clear | Level 6 |
| Victoria Island | Heavy | Rain | Level 10 |
| Lekki | Very Heavy | Rain + Night | Level 15 |

---

## City / Map Design

### World Layout
- **Linear corridor** (like Subway Surfers) — city scrolls toward player, bike stays near `z=0`
- **Track-distance model (frozen):** all gameplay uses `trackDistance` (meters travelled). Restaurants / customers / obstacles spawn at `trackDistance + offset`, never at static world `{x,z}`. Lane = `x in [-3,0,3]`.
- **5 zones**, each ~2 km of road, straight segments only for MVP (no curves/intersections — incompatible with 3-lane scroller; revisit in Phase 3)
- **Zone transition:** crossfade fog color + landmark swap at 2000m intervals; difficulty = traffic density multiplier per zone
- **Landmarks** per zone for orientation:
  - Yaba: Yaba Market, University of Lagos gate
  - Ojuelegba: Ojuelegba Bridge, street murals
  - Ikeja: Ikeja Mall, Computer Village
  - VI: Shoprite, Lekki-Ikoyi Link Bridge
  - Lekki: Lekki Phase 1 gates, malls

### Road Generation (straight-only MVP)
- Procedural straight segments only (`SEGMENT_LENGTH=50`, `SEGMENT_COUNT=8`)
- Each segment has: road, sidewalk, buildings, props, street furniture
- Segments recycled (object pooling) for infinite road — no allocation after init
- Spawns (pickup/delivery/obstacles) attach to segment via `trackDistance`, recycled with segment

---

## Audio Design (Phase 2 — MVP silent except WebAudio beeps)

### Music
- **Radio station (Phase 2+)** — original loops only, no licensed Afrobeats. Menu = chill lo-fi loop, gameplay = upbeat 120 BPM loop, tempo +5% per zone.
- MVP: no Howler playlist; use tiny WebAudio oscillator beeps for pickup/deliver to avoid asset weight.

### SFX (source + license check required)
| Sound | Source | Phase |
|-------|--------|-------|
| Bike engine | Freesound motorcycle recording, pitch varies with speed | Phase 2 |
| Horn | Freesound okada horn | MVP beep fallback |
| Pickup ding | WebAudio osc | MVP |
| Delivery success | WebAudio arpeggio | MVP |
| Crash | Freesound impact + skid | Phase 2 |
| Rain | Freesound ambient loop | Phase 2 |
| Police siren | Freesound distant siren | Phase 2 |

---

## UI / HUD

### In-Game HUD
```
┌─────────────────────────────────────────────┐
│  ₦12,500  │  🔥 75%  │  ⭐ 4.5  │  ⏱ 2:30  │
│  Cash     │  Heat   │  Rating │  Time     │
├─────────────────────────────────────────────┤
│                                             │
│              [3D GAME VIEW]                 │
│                                             │
│         ┌───┐                               │
│         │ ↑ │  GPS arrow                    │
│         └───┘                               │
│                                             │
├─────────────────────────────────────────────┤
│  [Horn]  [Hop]  [Brake]  [Gas]  [Deliver]  │
│  (mobile touch controls)                    │
└─────────────────────────────────────────────┘
```

### Menus
- **Main Menu:** Title, Play, Garage, Leaderboard, Settings, Mute
- **Garage:** 3D bike preview, upgrade buttons, paint color picker
- **Results:** Earnings breakdown, XP bar, rating stars, next shift button
- **Leaderboard:** Tabs (Today / Week / All Time), player rank highlighted

---

## Monetization (post-launch — NOT MVP)

| Model | Implementation | Provider |
|-------|---------------|----------|
| **Free to play** | Full game accessible | — |
| **Revive ad (Phase 4)** | Watch ad to continue after crash (3 per session) | Google AdSense for Games or Poki SDK (TBD) |
| **Cosmetic IAP (Phase 4)** | Bike skins, thermal bag designs | Stripe / RevenueCat + backend validation (Vercel function) |
| **Battle Pass (Phase 4)** | "Mama Put Pro" — weekly challenges | Firestore + Cloud Function |
| **Sponsored content (Phase 4)** | Fictional brands as billboards for MVP; real brands only with written permission | — |

> MVP has no ads/IAP. Do not add SDKs in Phase 1-2.

---

## Development Roadmap

> Executable specs: `docs/prompts/1A-scaffold.md` … `1J-integration.md` (detailed — use those, not just summaries below). Rules: `docs/AGENT.md`. Tracker: `docs/PROGRESS.md` — agent updates after every sub-phase.

### Phase 1 — MVP (2–3 weeks)

> **Modularization Rule:** No file exceeds 200 lines. Each sub-phase produces small, focused modules. If a file grows beyond 200 lines, split it before moving on.

---

#### 1A — Project Scaffold

> Detailed spec: `docs/prompts/1A-scaffold.md` — use that file to implement. Summary below.

**Files created:**
- `package.json` — deps: three, vite, typescript
- `tsconfig.json` — strict mode, ESNext, DOM libs
- `vite.config.js` — base config + `.glb` / `.ktx2` assetsInclude
- `index.html` — canvas + UI overlay + HUD skeleton (see prompt — must match HUD.ts IDs)
- `src/main.ts` — entry point, creates Engine
- `src/core/Engine.ts` — renderer, scene, camera, resize handler + quality tiers
- `src/core/GameLoop.ts` — requestAnimationFrame loop with delta time
- `src/style.css` — reset + fullscreen canvas
- `src/data/economy.ts` — payout / XP / rating / timer constants (added per review fix)

**Implementation Prompt:**
```
Scaffold a Vite + TypeScript project for a Three.js browser game called Chow Rush.

Create these files:
1. package.json — deps: three, vite, typescript, @types/three
2. tsconfig.json — strict, ESNext, DOM libs, moduleResolution: bundler
3. vite.config.js — include assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.ktx2'], server.host true for mobile testing
4. index.html — fullscreen canvas id="game-canvas", UI overlay div id="ui-overlay" CONTAINING:
   <div id="hud"><span id="hud-cash"></span><span id="hud-heat"></span><span id="hud-rating"></span><span id="hud-time"></span></div>
   <div id="menu"></div><div id="results"></div><div id="touch-controls"></div>
   IDs must exactly match src/ui/hudConfig.ts or 1H will fail.
5. src/main.ts — import Engine, create instance, start (<50 lines, no game logic)
6. src/core/Engine.ts — Three.js WebGLRenderer, PerspectiveCamera (FOV 60 desktop / 68 portrait mobile), Scene, resize handler, setQualityTier('high'|'medium'|'low'), render() method
7. src/core/GameLoop.ts — requestAnimationFrame loop, delta time calculation (clamp dt <= 0.05), update/render callbacks
8. src/style.css — reset margins, fullscreen canvas, hidden overflow
9. src/data/economy.ts — SHIFT_TIME=150, TIME_BONUS=15, MAX_TIME=180, XP_HOT=100, XP_WARM=60, XP_COLD=20, RATING_COLD=-0.5, RATING_CRASH=-1.0, RATING_HOT=+0.1, TIP_BASE=200, STREAK_BONUS=100, LEVELS={2:300,3:800,5:2000,10:8000,15:20000,20:40000}

Rules:
- No file over 200 lines (main.ts under 50)
- Engine.ts only handles renderer/scene/camera setup + quality tiers
- GameLoop.ts only handles the animation loop
- main.ts only wires them together
- Use ES modules, no CommonJS
- No Cannon/Rapier deps — arcade collision only

Verify: npm install && npm run dev starts without errors.
```

**Review Prompt:**
```
Review the project scaffold for Chow Rush.

Check:
- All files under 200 lines (main.ts under 50)
- tsconfig.json has strict: true
- index.html contains #game-canvas, #ui-overlay, #hud, #hud-cash, #hud-heat, #hud-rating, #hud-time, #menu, #results, #touch-controls
- Engine.ts creates a visible scene (add a test cube if needed), FOV 60/68, setQualityTier exists
- GameLoop.ts clamps dt <= 0.05
- economy.ts exports all SHIFT_TIME / XP / RATING constants
- No physics deps in package.json
- No console errors in browser
- npm run build passes with no TypeScript errors

List any issues found. If clean, say "Scaffold approved, proceed to 1B."
```

---

#### 1B — Input System

> Detailed spec: `docs/prompts/1B-input.md`.

**Files created:**
- `src/systems/Input.ts` — keyboard state tracker
- `src/systems/TouchInput.ts` — touch state tracker
- `src/types/input.ts` — InputState type

**Implementation Prompt:**
```
Implement the input system for Chow Rush.

Create:
1. src/types/input.ts — InputState interface: left, right, up, down, hop, horn, action (all boolean)
2. src/systems/Input.ts — Keyboard class: tracks keydown/keyup, exposes getInput(): InputState
3. src/systems/TouchInput.ts — Touch class: tracks touch zones (left/right halves, buttons), exposes getInput(): InputState

Rules:
- Keyboard: ArrowLeft/A, ArrowRight/D, ArrowUp/W, ArrowDown/S, Space, H, E
- Touch: left third = left, right third = right, middle = gas, swipe up = hop
- Both classes implement same interface so they're swappable
- No file over 200 lines
- Export a combined getInput() that merges keyboard + touch

Verify: npm run build passes.
```

**Review Prompt:**
```
Review the input system for Chow Rush.

Check:
- InputState type is exported and used consistently
- Keyboard and Touch classes have same interface
- No file over 200 lines
- No TypeScript errors
- Touch zones make sense for mobile (left/right steer, middle gas)

List any issues. If clean, say "Input approved, proceed to 1C."
```

---

#### 1C — Player Bike (Greybox)

> Detailed spec: `docs/prompts/1C-bike.md`.

**Files created:**
- `src/player/Bike.ts` — bike mesh, position, speed
- `src/player/BikeController.ts` — reads Input, updates Bike
- `src/data/bikeConfig.ts` — speed, acceleration, lane width constants

**Implementation Prompt:**
```
Implement the player bike for Chow Rush (greybox version).

Create:
1. src/data/bikeConfig.ts — constants: LANE_WIDTH=3, LANES=[-3,0,3], MAX_SPEED=60, ACCELERATION=20, BRAKE_FORCE=30
2. src/player/Bike.ts — class with: mesh (BoxGeometry placeholder), laneIndex (0-2), speed, position. Methods: update(dt), setLane(index), accelerate(), brake(), getPosition()
3. src/player/BikeController.ts — reads InputState, calls Bike methods. Handles lane switching (left/right), acceleration, braking.

Rules:
- Bike starts in middle lane (index 1)
- Lane switching is instant (no lerp yet — that's polish)
- Speed clamped to [0, MAX_SPEED]
- No file over 200 lines
- Use bikeConfig constants, no magic numbers

Verify: npm run build passes. In browser, bike responds to arrow keys.
```

**Review Prompt:**
```
Review the bike implementation for Chow Rush.

Check:
- Bike.ts only handles mesh + movement state
- BikeController.ts only handles input → bike mapping
- bikeConfig.ts has all tunable constants
- No file over 200 lines
- No magic numbers in Bike/BikeController
- Lane switching works (left/right arrows)
- Speed increases/decreases smoothly

List any issues. If clean, say "Bike approved, proceed to 1D."
```

---

#### 1D — Road & City Greybox

> Detailed spec: `docs/prompts/1D-city.md`.

**Files created:**
- `src/world/Road.ts` — road mesh, lane markings
- `src/world/Building.ts` — building mesh generator
- `src/world/CityScroller.ts` — moves world toward player, recycles segments
- `src/data/cityConfig.ts` — road width, building count, segment length

**Implementation Prompt:**
```
Implement the road and city greybox for Chow Rush (straight-only, track-distance).

Create:
1. src/data/cityConfig.ts — ROAD_WIDTH=12, LANE_COUNT=3, SEGMENT_LENGTH=50, BUILDING_COUNT=10, SEGMENT_COUNT=8, LANES=[-3,0,3]
2. src/world/Road.ts — class with: mesh (PlaneGeometry), lane markings (thin boxes), update(dt, speed) to scroll texture/position
3. src/world/Building.ts — static class: createBuilding(width, height, depth, color) returns Mesh. Random height/color from palette (low-poly boxes only).
4. src/world/CityScroller.ts — manages array of segments. Each segment = Group with road + buildings on sides. Tracks trackDistance += speed*dt. update(dt, speed) moves segments toward camera, recycles when behind. Exposes getTrackDistance().

Rules:
- Straight segments only — no curves/intersections (incompatible with 3-lane scroller)
- Road is a long plane with lane markings
- Buildings are simple boxes on both sides of road
- Segments recycle (object pooling) — no new objects created after init
- Spawns attach via trackDistance, not static x/z
- No file over 200 lines
- Use cityConfig constants

Verify: npm run build passes. In browser, road scrolls toward player.
```

**Review Prompt:**
```
Review the city greybox for Chow Rush.

Check:
- Road.ts only handles road mesh + lane markings
- Building.ts only creates building meshes
- CityScroller.ts only handles segment recycling
- cityConfig.ts has all tunable constants
- No file over 200 lines
- Segments recycle properly (no memory leak)
- Buildings appear on both sides of road
- Road scrolls smoothly

List any issues. If clean, say "City approved, proceed to 1E."
```

---

#### 1E — Camera Follow

> Detailed spec: `docs/prompts/1E-camera.md`.

**Files created:**
- `src/core/Camera.ts` — camera rig that follows bike

**Implementation Prompt:**
```
Implement the camera system for Chow Rush.

Create:
1. src/core/Camera.ts — class with: PerspectiveCamera (FOV 60 desktop, 68 portrait mobile), target (Vector3), update(dt, bikePosition). Camera sits behind and above bike, looks ahead. Smooth lerp to target position.

Rules:
- Camera offset: behind bike by 10 units, above by 5 units
- Look at point: 10 units ahead of bike
- Smooth follow with lerp factor 5.0*dt (no snapping)
- FOV set in Engine.ts, Camera.ts only positions/lookAt
- No file over 200 lines
- Export Camera class with update(dt, bikePosition) method

Verify: npm run build passes. In browser, camera follows bike smoothly.
```

**Review Prompt:**
```
Review the camera system for Chow Rush.

Check:
- Camera follows bike smoothly (no jitter)
- Camera angle shows road ahead clearly
- No file over 200 lines
- Lerp factor is reasonable (not too slow, not too fast)
- Camera doesn't clip through buildings

List any issues. If clean, say "Camera approved, proceed to 1F."
```

---

#### 1F — Delivery System (Basic, track-distance)

> Detailed spec: `docs/prompts/1F-delivery.md`.

**Files created:**
- `src/gameplay/Order.ts` — order data structure
- `src/gameplay/DeliveryManager.ts` — spawns orders, tracks pickup/delivery
- `src/gameplay/Collision.ts` — AABB / lane + distance checks (no physics lib)
- `src/data/restaurants.ts` — restaurant data (name, dishIds — no static positions)
- `src/data/dishes.ts` — dish data (name, heatCapacity, basePrice)

**Implementation Prompt:**
```
Implement the basic delivery system for Chow Rush (track-distance version).

Create:
1. src/data/dishes.ts — array of dishes: [{id, name, heatCapacity, basePrice}]. Include: Jollof Rice (30s, 500), Suya (45s, 300), Puff Puff (20s, 200)
2. src/data/restaurants.ts — array of restaurants: [{id, name, dishIds}]. Include: Mama Put (dishes: [jollof, puffpuff]). NO static x/z positions — spawns use trackDistance.
3. src/gameplay/Order.ts — class with: id, dish, restaurant, pickupDistance, dropoffDistance, lane, payout, state ('pending'|'pickup'|'delivering'|'delivered'). Methods: getState(), setState()
4. src/gameplay/Collision.ts — pure functions: inZone(bikeLane, bikeDistance, targetLane, targetDistance, radiusLane=0.5, radiusDist=5): boolean. No Three.js.
5. src/gameplay/DeliveryManager.ts — manages current order. Methods: spawnOrder(currentTrackDistance), update(dt, bikeLane, trackDistance), getCurrentOrder(). Spawns pickup at currentTrackDistance+80, dropoff at pickup+120. Uses Collision.inZone for detection. Payout = basePrice + TIP_BASE(0-200 random) * heatMultiplier + streakBonus from economy.ts.

Rules:
- One active order at a time
- Pickup zone = |trackDistance - pickupDistance| < 5 AND same lane (radiusLane 0.5)
- Delivery zone = same test vs dropoffDistance
- No static world positions
- No file over 200 lines
- Use dish/restaurant/economy data from data files

Verify: npm run build passes. In browser, order spawns 80m ahead and can be picked up.
```

**Review Prompt:**
```
Review the delivery system for Chow Rush.

Check:
- Order.ts only handles order state
- DeliveryManager.ts only handles order lifecycle
- dishes.ts and restaurants.ts are pure data (no logic)
- No file over 200 lines
- Order spawns correctly
- Pickup zone detection works
- Delivery zone detection works
- Payout calculation is correct

List any issues. If clean, say "Delivery approved, proceed to 1G."
```

---

#### 1G — Heat Meter

> Detailed spec: `docs/prompts/1G-heat.md`.

**Files created:**
- `src/gameplay/HeatMeter.ts` — tracks food temperature over time

**Implementation Prompt:**
```
Implement the heat meter for Chow Rush.

Create:
1. src/gameplay/HeatMeter.ts — class with: maxHeat (from dish.heatCapacity), currentHeat, state ('hot'|'warm'|'cold'). Methods: update(dt), reset(capacity), getHeatPercent(), getState(), getTipMultiplier(). Heat drains linearly. Tip multiplier: hot=1.0, warm=0.5, cold=0.0.

Rules:
- Heat drains from maxHeat to 0 over dish.heatCapacity seconds
- State thresholds (fraction): hot = heat > 0.66, warm = 0.33 < heat <= 0.66, cold = heat <= 0.33
- getTipMultiplier() returns 1.0, 0.5, or 0.0 based on state
- No file over 200 lines
- Pure logic, no Three.js dependencies

Verify: npm run build passes.
```

**Review Prompt:**
```
Review the heat meter for Chow Rush.

Check:
- Heat drains linearly over correct duration
- State thresholds are hot >0.66, warm 0.33-0.66, cold <=0.33
- Tip multipliers are correct (1.0, 0.5, 0.0)
- No file over 200 lines
- No Three.js imports (pure logic)
- Unit-testable (could extract and test in isolation)

List any issues. If clean, say "HeatMeter approved, proceed to 1H."
```

---

#### 1H — HUD (Basic)

> Detailed spec: `docs/prompts/1H-hud.md`.

**Files created:**
- `src/ui/HUD.ts` — updates DOM elements with game state
- `src/ui/hudConfig.ts` — HUD element IDs and formatting

**Implementation Prompt:**
```
Implement the basic HUD for Chow Rush.

Create:
1. src/ui/hudConfig.ts — constants: element IDs for cash, heat, rating, time. Format functions: formatCurrency(n), formatTime(seconds), formatHeat(percent)
2. src/ui/HUD.ts — class with: constructor() grabs DOM elements, update(state: {cash, heatPercent, rating, time}). Updates DOM text content.

Rules:
- HUD only reads state, never writes game state
- DOM elements: #hud-cash, #hud-heat, #hud-rating, #hud-time
- Format: cash = "₦12,500", heat = "75%", rating = "4.5", time = "2:30"
- No file over 200 lines
- No Three.js dependencies (pure DOM manipulation)

Verify: npm run build passes. In browser, HUD updates when state changes.
```

**Review Prompt:**
```
Review the HUD for Chow Rush.

Check:
- HUD.ts only manipulates DOM, no game logic
- hudConfig.ts has all element IDs and formatters
- No file over 200 lines
- No Three.js imports
- Format functions produce correct output (₦12,500 / 75% / 4.5 / 2:30)
- DOM elements exist in index.html

List any issues. If clean, say "HUD approved, proceed to 1I."
```

---

#### 1I — Game State Machine

> Detailed spec: `docs/prompts/1I-gamestate.md`.

**Files created:**
- `src/core/GameState.ts` — state machine (menu, playing, paused, results)
- `src/core/Game.ts` — orchestrates all systems (must stay <200 lines — delegate to helpers if needed)

**Implementation Prompt:**
```
Implement the game state machine and main orchestrator for Chow Rush.

Create:
1. src/core/GameState.ts — enum GameState { MENU, PLAYING, PAUSED, RESULTS }. Class with: currentState, setState(newState), isPlaying(). Persist best cash/XP to localStorage.
2. src/core/Game.ts — class with: engine, camera, bike, bikeController, cityScroller, deliveryManager, heatMeter, hud, input, collision, economy state {cash, xp, rating, timeLeft, streak, crashes}. Methods: start(), pause(), resume(), reset(), addTime(), applyRating(delta). update(dt) calls all system updates when PLAYING: trackDistance += speed*dt, timeLeft -= dt, heatMeter.update, deliveryManager.update, collision checks, hud.update. Shift ends when timeLeft<=0 or crashes>=3 → RESULTS.

Rules:
- Game.ts wires all systems together (composition root) — no building/road math inside; delegate to CityScroller/DeliveryManager/Collision
- update(dt) only runs when state === PLAYING, dt clamped <=0.05
- start() resets cash=0, xp=0, rating=5.0, timeLeft=SHIFT_TIME, streak=0, crashes=0 and sets PLAYING
- pause() sets PAUSED, resume() sets PLAYING
- No file over 200 lines — if Game.ts exceeds, extract UpdateSystems.ts helper (counts toward limit)
- All systems independent, communicate via Game (no circular imports)
- localStorage for MVP persistence; no Firestore calls in Phase 1

Verify: npm run build passes. In browser, game starts, pauses, resumes, ends on timer.
```

**Review Prompt:**
```
Review the game state machine for Chow Rush.

Check:
- GameState enum has all 4 states
- Game.ts is composition root (wires systems, doesn't implement logic)
- No file over 200 lines
- update(dt) only runs when PLAYING
- start() resets all systems
- pause/resume work correctly
- No circular dependencies between systems

List any issues. If clean, say "State machine approved, Phase 1 MVP complete."
```

---

#### 1J — Integration Test

> Detailed spec: `docs/prompts/1J-integration.md`.

**Files created:**
- `src/main.ts` — updated to use Game class

**Implementation Prompt:**
```
Integrate all Phase 1 systems into the main entry point for Chow Rush.

Update:
1. src/main.ts — create Game instance, call game.start(). Handle window resize.

Rules:
- main.ts is thin — only creates Game and starts it
- No game logic in main.ts
- No file over 50 lines

Verify: npm run dev starts the game. In browser:
- Greybox bike on a road
- Arrow keys steer and accelerate
- Road scrolls toward player
- Camera follows bike
- Order spawns, pickup and delivery work
- HUD shows cash, heat, rating, time
- Game pauses and resumes
```

**Review Prompt:**
```
Review the full Phase 1 integration for Chow Rush.

Check:
- All systems work together
- No console errors
- No TypeScript errors
- All files under 200 lines (main.ts under 50)
- Game is playable: drive, pick up, deliver, earn cash
- Heat meter drains and affects payout
- HUD updates in real-time
- Pause/resume works
- 60 FPS on desktop

List any issues. If clean, say "Phase 1 MVP approved and complete."
```

---

### Phase 2 — Core Game (3–4 weeks)
- [ ] All 5 zones with straight-segment generation + fog/landmark transitions
- [ ] 5 restaurants with different dishes (track-distance spawns)
- [ ] Heat meter + tip/streak/rating system (from economy.ts)
- [ ] Obstacles: potholes, vendors, pedestrians (AABB); police/traffic/rain deferred within phase
- [ ] Upgrades + garage
- [ ] Audio: original loops + Freesound SFX (no licensed Afrobeats)
- [ ] Firebase auth + leaderboard (schema below) + localStorage fallback offline

### Firebase Schema (Phase 2, not MVP)
```
// users/{uid}: { displayName, level, xp, bestCash, rating, createdAt }
// leaderboards/{weeklyId}/scores/{uid}: { cash, deliveries, hotRate, updatedAt }
// No client writes to other users; validate via rules: auth != null, score increment limits
```
- Auth: anonymous → link Google. Offline: play with localStorage, sync on reconnect.
- Security rules: users can write own doc only; leaderboard writes throttled (1/min per uid).

### Phase 3 — Polish (2–3 weeks)
- [ ] Photoreal PBR upgrade path (optional fork — keep low-poly default)
- [ ] Post-processing High-tier only (bloom, vignette, color grading — off on Low)
- [ ] Weather effects (rain, night) + Tires/Headlight upgrades activate here
- [ ] Mobile controls optimization + touch-controls div
- [ ] Loading screen + asset streaming + KTX2
- [ ] PWA manifest (installable)

### Phase 4 — Launch (1–2 weeks)
- [ ] Analytics (Firebase Analytics, GDPR consent)
- [ ] Monetization SDKs (AdSense/Poki, Stripe/RevenueCat) — not before this phase
- [ ] Marketing assets (screenshots, trailer)
- [ ] Deploy to Vercel + soft launch (set Vercel env from .env.example)

---

## Next Steps

1. **Set up Vite + TypeScript + Three.js project** — `npm create vite@latest` (include HUD skeleton + economy.ts in 1A)
2. **Source low-poly 3D assets** — Quaternius/Poly Pizza/Kenney only for MVP; log gaps needing custom models
3. **Build greybox scene (straight segments, track-distance)** — road, boxes, placeholder bike
4. **Implement lane-switching + arcade collision** — no physics lib
5. **Add one delivery loop (track-distance spawn → pickup → deliver → payout from economy.ts)** — pickup → deliver → get paid
6. **Iterate on feel** — juice, screen shake, speed lines
7. **Expand** — more zones, restaurants, obstacles
8. **Polish** — High-tier post only, audio, UI
9. **Deploy** — Vercel (copy .env to Vercel env), share link

---

*Document updated: 2026-10-01 — docs/AGENT.md + PROGRESS.md + prompts/1A-1J added, plan linked*
*Status: Planning phase*
*Stack: TypeScript + Three.js (arcade collision) + Firebase + Vercel*
