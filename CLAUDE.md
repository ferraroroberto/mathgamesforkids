# Project Instructions

Canonical instructions for AI coding agents working in this repository. Claude Code reads this file directly as project memory. Other agents (Cursor, Codex, etc.) reach it via the one-line `AGENTS.md` pointer.

## Plan mode is the default

Every non-trivial request starts in plan mode (anything beyond a one-line fix, a typo, or a question answerable without touching code). In plan mode: investigate freely, but don't edit files, run destructive commands, or commit. Present the plan, and only execute after explicit approval.

## What this project is

A static, dependency-light collection of browser games, math tools, and HTML experiments for kids. No build step, no framework, no `package.json` — open `index.html` in a browser and it runs.

## Stack & layout

- Vanilla **HTML5 / CSS3 / ES6+**, HTML5 **Canvas** for the games. No bundler, no framework.
- `index.html` — the hub / navigation page.
- `games/` — each game is a **single self-contained `.html`** (embedded CSS + JS): `mountain_dung_dodger`, `elemental_warrior`, `fifteen_puzzle`, `tetris`, `birds_vs_robots`.
- `math/` — shared, reusable modules the games import via relative paths (`<script src="../math/...">`):
  - `mathTests.js` — the `MathTests` class; grade 1–5 problem generator.
  - `mathSessionUI.js` — `createMathSessionUI(options)` factory: the shared problem-render → feedback → progress-bar → 1500 ms cadence → finish loop. Each game passes its own DOM ids and an `onFinish(summary)` callback.
  - `livesReward.js` — `livesRewardFromSession(player, summary)`: lives bookkeeping for the two platformers (3 correct → +1 life capped at 5, 2 → no change, else → −1 floored at 1).
  - `test_math.html` — standalone testing interface for the math module.
- `funstuff/` — standalone HTML experiments, each with its own `*.README.md`.

## Conventions

- **Reuse the `math/` modules — don't re-inline.** The session loop and lives logic were deliberately factored out of the games into `mathSessionUI.js` / `livesReward.js` (they were byte-for-byte duplicated before). Extend the shared helper; never paste a fresh copy into a game.
- Games wire their submit button via `addEventListener` against the factory's returned handlers — **no global aliasing**.
- Canvas games use the standard `update()` → `draw()` → `requestAnimationFrame()` loop and a simple string game-state machine (`'start'`, `'playing'`, `'math'`, `'gameover'`).
- **Mobile-first**: large touch controls, viewport locked against zoom, 60 FPS target.
- Dependencies are per-game and **CDN-only** (Tetris: Tone.js + Tailwind + Press Start 2P; Birds vs Robots: Tailwind + Press Start 2P; the rest are vanilla). Keep new games dependency-free unless there's a real need.
- **Adding a game:** drop the `.html` in `games/`, wire any math through the shared modules, and link it from `index.html`.

## Running locally

Static site — open `index.html` directly, or serve it so relative module paths resolve cleanly:

```bash
python -m http.server 8000   # then http://localhost:8000/
```

Test the math module at `http://localhost:8000/math/test_math.html`.

## Git

Conventional commit prefixes (`feat:` `fix:` `refactor:` `docs:` `chore:`). Never add `Co-Authored-By: Claude` or any AI-attribution trailer. Don't commit or push unless asked.
