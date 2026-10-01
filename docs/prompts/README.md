# Prompts index — execute in order

Run one at a time. After each: `npm run type-check && npm run build`, browser verify, update `../PROGRESS.md`, wait for human approval.

| # | File | Builds |
|---|------|--------|
| 1A | `1A-scaffold.md` | package/tsconfig/vite/index/Engine/GameLoop/economy |
| 1B | `1B-input.md` | types/input, systems/Input+Touch |
| 1C | `1C-bike.md` | bikeConfig, Bike, BikeController |
| 1D | `1D-city.md` | cityConfig, Road, Building, CityScroller |
| 1E | `1E-camera.md` | core/Camera |
| 1F | `1F-delivery.md` | dishes, restaurants, Order, Collision, DeliveryManager |
| 1G | `1G-heat.md` | HeatMeter |
| 1H | `1H-hud.md` | hudConfig, HUD |
| 1I | `1I-gamestate.md` | GameState, Game |
| 1J | `1J-integration.md` | main wiring + E2E |

Rules: `../AGENT.md` §3 applies to all. No skipping. No combining phases.
