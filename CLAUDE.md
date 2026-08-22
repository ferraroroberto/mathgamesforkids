# Project Instructions

Static, dependency-light browser games, math tools, and HTML experiments for kids. No build step, no framework, no `package.json` — open `index.html` in a browser and it runs.

## Stack & layout

- Vanilla **HTML5 / CSS3 / ES6+**, HTML5 **Canvas** for the games. No bundler, no framework.
- `index.html` — the hub / navigation page.
- `games/` — each game is a **single self-contained `.html`** (embedded CSS + JS): `mountain_dung_dodger`, `elemental_warrior`, `fifteen_puzzle`, `tetris`, `birds_vs_robots`.
- `math/` — shared modules the games import via relative paths (`<script src="../math/...">`):
  - `mathTests.js` — the `MathTests` class; grade 1–5 problem generator.
  - `mathSessionUI.js` — `createMathSessionUI(options)` factory: the shared problem-render → feedback → progress-bar → 1500 ms cadence → finish loop. Each game passes its own DOM ids and an `onFinish(summary)` callback.
  - `livesReward.js` — `livesRewardFromSession(player, summary)`: lives bookkeeping for the two platformers (3 correct → +1 life capped at 5, 2 → no change, else → −1 floored at 1).
  - `test_math.html` — standalone testing interface for the math module.
- `funstuff/` — standalone HTML experiments, each with its own `*.README.md`.

## Internal architecture

[`docs/architecture.mmd`](docs/architecture.mmd) — hand-authored Mermaid diagram of this repo's internal structure. Update it in the **same PR** as any material structural change (a new game, a new shared math module, a new external dependency). Not auto-generated; no gate checks it for drift.

## Conventions

- **Reuse the `math/` modules — don't re-inline.** Extend the shared helper; never paste a fresh copy into a game — the session loop and lives logic were factored into `mathSessionUI.js` / `livesReward.js` precisely because they had been byte-for-byte duplicated.
- Games wire their submit button via `addEventListener` against the factory's returned handlers — **no global aliasing**.
- Canvas games use the standard `update()` → `draw()` → `requestAnimationFrame()` loop and a simple string game-state machine (`'start'`, `'playing'`, `'math'`, `'gameover'`).
- **Mobile-first**: large touch controls, viewport locked against zoom, 60 FPS target.
- Dependencies are per-game and **CDN-only** (Tetris: Tone.js + Tailwind + Press Start 2P; Birds vs Robots: Tailwind + Press Start 2P; the rest vanilla). **Keep new games dependency-free** unless there's a real need.
- **Adding a game:** drop the `.html` in `games/`, wire any math through the shared modules, and link it from `index.html`.

## Running locally

Static site — open `index.html` directly, or serve it so relative module paths resolve:

```bash
python -m http.server 8000   # then http://localhost:8000/
```

Math module: `http://localhost:8000/math/test_math.html`.

## Git
*Restated here because agents arriving via `AGENTS.md` alone never see the machine config.*

Conventional commit prefixes (`feat:` `fix:` `refactor:` `docs:` `chore:`). Never add `Co-Authored-By: Claude` or any AI-attribution trailer. Don't commit or push unless asked.
