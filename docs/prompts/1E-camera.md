# 1E — Camera Follow (detailed)

Depends on: 1C, 1D. Next: 1F.

## Goal

Smooth chase cam showing road ahead.

## File

- `src/core/Camera.ts` — `class CameraRig {camera:PerspectiveCamera (from Engine); offset=new Vector3(0,5,10); lookAhead=10; lerpRate=5.0; update(dt,bikePos:Vector3): desired=bikePos+offset; camera.position.lerp(desired,1-exp(-lerpRate*dt)); lookAt(bikePos.x*0.5,1,bikePos.z-lookAhead) }`.

## Rules

- FOV owned by Engine (60/68). This file positions only.
- Frame-rate independent damping (`exp`), no snapping.
- No clipping: y=5 keeps above buildings boxes (max 14 tall but set back from road).

## Verify

Build passes. Bike steers left/right — camera trails smoothly, road ahead visible ~40m, no jitter at 60fps or 30fps (throttle test).

## Review

- [ ] lerp ~5.0*dt, no hard set
- [ ] look-ahead 10, offset 10/5
- [ ] <200 lines

Mark PROGRESS 1E `[x]`.
