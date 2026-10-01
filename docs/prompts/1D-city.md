# 1D — Road & City Greybox (detailed)

Depends on: 1A, 1C. Next: 1E.

## Goal

Infinite straight road with recycled segments + `trackDistance` clock. No curves.

## Files

1. `src/data/cityConfig.ts` — `ROAD_WIDTH=12 LANE_COUNT=3 SEGMENT_LENGTH=50 SEGMENT_COUNT=8 BUILDING_COUNT=10 PALETTE=[...6 Lagos colors]`.
2. `src/world/Road.ts` — `PlaneGeometry(ROAD_WIDTH,SEGMENT_LENGTH)` rotated flat, dark asphalt + 2 white lane strips (thin Box). `update()` static (Scroller moves group).
3. `src/world/Building.ts` — `static createBuilding(w,h,d,color):Mesh(BoxGeometry, MeshStandardMaterial flat)`; `randomBuilding():Mesh` height 4–14.
4. `src/world/CityScroller.ts` — `segments:Group[]; trackDistance=0; init(scene): create SEGMENT_COUNT groups at z=-i*LEN with road+buildings both sides; update(dt,speed): trackDistance+=speed*dt; groups.position.z+=speed*dt; if z>30 recycle z-=COUNT*LEN + re-randomize buildings; getTrackDistance()`.

## Rules

- Straight only. Object pooling — zero `new` after `init` (reuse + rescale buildings).
- No gameplay spawns here; expose distance for 1F.
- Buildings x=±(ROAD_WIDTH/2+2..8), never on road.

## Verify

Build passes. Browser: road scrolls toward camera proportional to bike speed, buildings both sides, no GC hitch (perf tab flat), no z-fighting.

## Review

- [ ] separation Road/Building/Scroller clean
- [ ] recycle math exact (`COUNT*LEN`)
- [ ] <200 lines, config-driven

Mark PROGRESS 1D `[x]`.
