# 1H — HUD Basic (detailed)

Depends on: 1A (IDs), 1F/1G (values). Next: 1I.

## Goal

Read-only DOM HUD.

## Files

1. `src/ui/hudConfig.ts` — `IDS={cash:'hud-cash',heat:'hud-heat',rating:'hud-rating',time:'hud-time'}; formatCurrency(n)=>'₦'+n.toLocaleString('en-NG'); formatHeat(p)=>Math.round(p*100)+'%'; formatRating(r)=>r.toFixed(1); formatTime(s)=>`${m}:${ss.padStart(2,'0')}``.
2. `src/ui/HUD.ts` — `constructor(): grab by ID (throw if missing); update(s:{cash,heatPercent,rating,timeLeft}): textContent=formats + heat color (green>0.66 orange>0.33 red else)`.

## Rules

- Never writes game state. No Three.js. Cache element refs.
- Must match `index.html` IDs or throw early with clear message.

## Verify

Build passes. Start shift — cash/heat/rating/time update every frame, formats `₦12,500 / 75% / 4.5 / 2:30`.

## Review

- [ ] formatters exact
- [ ] read-only, <200 lines
- [ ] missing-ID error

Mark PROGRESS 1H `[x]`.
