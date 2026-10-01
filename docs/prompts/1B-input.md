# 1B — Input System (detailed)

Depends on: 1A. Next: 1C.

## Goal

Unified keyboard + touch input exposing one `InputState`.

## Files

1. `src/types/input.ts` — `export interface InputState {left,right,up,down,hop,horn,action:boolean}` + `EMPTY_INPUT`.
2. `src/systems/Input.ts` — `Keyboard` class: `keydown/keyup` map ArrowLeft/A etc, `getInput():InputState`, `dispose()`. Prevent default for Space/arrows.
3. `src/systems/TouchInput.ts` — `Touch` class same interface: left-third=left, right-third=right, middle-hold=up(gas), buttons `#touch-*` for hop/horn/action, swipe-up=hop. `getInput()`.
4. Export `getCombinedInput(kb,touch):InputState` (OR-merge) — put in `Input.ts` or `utils`.

## Keymap (frozen)

Left Arrow/A, Right D, Up/W gas, Down/S brake, Space hop, H horn, E action.

## Pitfalls

- Stuck keys on blur → clear on `window.blur`.
- Touch scroll/zoom → `touch-action:none`, `preventDefault`.
- Do not read DOM game state here.

## Verify

`npm run type-check && npm run build`. Browser console: log merged state, press keys / touch zones, all booleans flip, no errors.

## Review

- [ ] identical interface, swappable
- [ ] <200 lines, no Three.js
- [ ] blur clears, mobile zones sane
- [ ] merged OR logic

Mark PROGRESS 1B `[x]`, await approval.
