# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FriendlyIFR — a browser-based IFR radio-navigation trainer (airplane, NDB/VOR beacons, cockpit instruments) for the Aeronautics department at the Faculty of Transport and Traffic Sciences. Fully static: one `index.html` + vanilla JS on vendored PixiJS 6.2.1, published via GitHub Pages from the repo root. Desktop-only (mobile is rejected in `application.js`).

## Commands

```
python -m http.server 8000     # from repo root → http://localhost:8000/
```

No build step, no bundler, no tests, no linter. JS is loaded as plain `<script>` tags — edit and reload. To simulate the GitHub Pages sub-path (`user.github.io/FriendlyIFR/`), serve the parent directory instead and open `/FriendlyIFR/`.

**All asset URLs must be relative without a leading `/` or `../`** (`static/...`, `lib/...`) so they resolve under the Pages sub-path. The exception is `styles/*.css`, where `../static/...` is correct because it's relative to the CSS file.

## Architecture

**Frontend** lives in `source/*.js`, all loaded as classic scripts into one global scope via `index.html`. **Load order matters** — each file relies on globals defined by earlier ones. Current order:

1. `elements.js` — `const` handles for every DOM control (`edSpeed`, `swInstrumentDG`, `btnTestMode`, …). Add new controls here.
2. `common.js` — constants (`WORLD_WIDTH`, `DISTANCE_SCALE`, instrument sizes), shared `let` globals (`app`, `viewport`, `player`, `wind`, `NDB`, `VORa`, `VORb`, `instr*`, `testModeState`, `objectMoving`), math helpers, and base classes `BaseSprite` / `MovableSprite`.
3. `misc.js`, `time.js` — page-level behaviour (leave confirmation, auto-pause on tab hide, input validation `validateInput`/`blinkInvalidInput`, clock + stopwatch).
4. `viewport.js`, `instrument-panel.js`, `wind.js`, `airplane.js`, `groundradars.js`, `instruments.js` — the sim classes.
5. `testmode.js`, `files.js`, `events.js` — test mode, save/load, DOM event wiring.
6. `application.js` — bootstraps PIXI, loads textures via `PIXI.Loader.shared`, `setup()` instantiates everything, `renderLoop(delta)` runs on `app.ticker`, keybinds, resize handling.

**Scene graph:** `app.stage` → `viewport` (pixi-viewport; world 6000×N, pan/zoom, holds `NDB`, `VORa`, `VORb`, `player` + trail) and `instrPanel` (`InstrumentPanel` container fixed to screen; holds the five instruments and auto-lays them out in a column via `updateInstrumentPositions()`).

**Class hierarchy:**
- `BaseSprite` → `MovableSprite` (drag via the global `objectMoving` lock; only one object drags at a time, `setObjectMoving()` also toggles viewport drag) → `Airplane`, `GroundRadar` → `NonDirectionalBeacon`, `VORBeacon`.
- `BaseSprite` → `Instrument` (owns optional compass rose / arrow / DME display, bound to a sidebar switch via `switchElement`) → `DirectionalGyro`, `RBI`, `RMI` (NDB-based), `HSI` (VORa: CRS knob via mousewheel), `CDI` (VORb: OBS knob).
- `Radial` (SmoothGraphics child of a `GroundRadar`) — drawn when the "Draw radial" toggle is active; shows bearing/distance labels.

**Coordinate conventions:** `_v(x, y)` converts global/screen coords to viewport-local. `DISTANCE_SCALE = 24` px per NM for DME/radial readouts (CDI's DME uses 20 — an existing inconsistency). Airplane movement divides speed by 9061 per tick as the world scale.

**Model ↔ UI sync:** setters on `Airplane.speed`, `Wind.speed/direction`, `VORBeacon.arcCurve*` write straight into the sidebar inputs; `pauseMovement`, `setVisible`, `setCourseLinesVisible` likewise keep switches in sync. Follow this pattern rather than updating DOM and model separately.

**Test mode** (`testModeState`, `testModeStates` in `common.js`, button logic in `events.js`): none → initiated (load a `.nav`, controls with class `can-disable` are disabled, airplane/course lines hidden) → started → finished → back to none. Guard interactive features with `isInTestMode()`.

**Save/load** (`files.js`): `.nav` files. New format is JSON (`saveSetup`/`doLoadSetup`); `loadSetupOld` parses the legacy line-indexed format from the original desktop app (best-effort, radial positions are unreliable). Any new persistent state must be added to both `saveSetup` and `doLoadSetup`.

## Assets

- `lib/` — vendored, minified PixiJS + plugins (viewport, graphics-smooth, mousewheel, fps). Not managed by npm; upgrade by replacing files.
- `static/application/` — instrument/beacon PNGs registered by name in `PIXI.Loader.shared` (`application.js`). Source PSDs in `static/psd/`. `DS-Digital` webfont for the DME display is force-loaded via `styles/digital-font.css`.
- Bootstrap 5 and Nunito come from CDNs (`index.html`).
