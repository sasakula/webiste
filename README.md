<div align="center">

# NeoLife

### Autonomous Cyberpunk NPC Life Simulator

A polished indie-feel simulation game crossed with an experimental AI dashboard.
Watch a living futuristic city evolve in real time — 28 NPCs walking, working,
eating, sleeping, fighting, falling in love and reacting to weather, economy,
and random events, all without any user interaction.

[Live Demo](#-deployment) ·
[Features](#-features) ·
[Tech Stack](#-tech-stack) ·
[Install](#-installation) ·
[Deploy](#-deployment)

</div>

---

## Overview

NeoLife is a **single-page web application** that simulates a procedurally
generated cyberpunk city populated by autonomous agents. Each NPC has a
personality, occupation, home, workplace, needs (hunger / energy / social),
mood, memory and a relationship graph. The world has its own weather state
machine, economy, crime index, and a continuous stream of random events —
robberies, lottery wins, marriages, breakups, power outages, protests,
art shows.

The result is an **idle livestream of a city that runs forever**. Open the tab,
walk away, come back to fresh drama on the feed.

```
┌────────────────────── TOPBAR ───────────────────────┐
│ NEOLIFE   Day 1  09:42  Economy: Stable     ● LIVE  │
└─────────────────────────────────────────────────────┘
┌──────────┬─────────────────────────────┬────────────┐
│  WORLD   │                             │  EVENT     │
│  STATUS  │       LIVE CITY VIEW        │  FEED      │
│  +       │   (canvas, cinematic cam)   │  +         │
│  CRIME / │                             │  DRAMA     │
│  WEATHER │                             │  LOGS      │
├──────────┴─────────────────────────────┴────────────┤
│              CITIZEN ROSTER (NPC cards)             │
└─────────────────────────────────────────────────────┘
```

## Features

**Simulation**

- 28 unique autonomous NPCs with persistent personalities and identities
- A* pathfinding over a hand-tunable tile grid
- Per-NPC needs, mood derivation, and bounded memory of recent events
- Emergent relationships: friendships, rivalries, marriages, breakups
- World subsystems: weather state machine, drifting economy, crime index
- Continuous random events: robbery, power outage, cafe promo, protest,
  traffic jam, breakup, marriage, job loss, lottery win, celebrity sighting,
  underground art show

**Visuals**

- Pixel-art inspired city baked once to an offscreen canvas, rebllitted each
  frame for performance
- Dark cyberpunk aesthetic — black background with neon cyan / violet accents
- Animated day/night cycle with emissive building glow at night
- Weather effects: rain particles, neon storm flashes, smog drift, fog tint
- Dynamic shadows, soft vignette, scanline overlay, ambient sparks
- Cinematic camera that auto-orbits landmarks, snaps to live incidents
  (with shake), and follows any NPC you click

**UI / UX**

- Responsive desktop-first layout with 4 panels (top bar + 3 sidebars + center)
- Live event feed with severity-coded entries you can click to follow actors
- NPC profile drawer with friends, rivals, partners and recent memory
- Speed controls (Pause / 1x / 2x / 4x / 8x) + keyboard shortcuts
- Day/night strip indicator, crime meter, employment %, weather flavor text
- All UI animated via Framer Motion

## Tech Stack

| Layer        | Choice                                              |
| ------------ | --------------------------------------------------- |
| Framework    | **React 18** (function components + hooks)         |
| Build tool   | **Vite 5** (fast HMR, modern ES output)             |
| Styling      | **Tailwind CSS 3** (custom neon palette + tokens)   |
| Animation    | **Framer Motion** (only for UI feeds & cards)       |
| Rendering    | **HTML Canvas 2D** (hand-rolled, no game engine)    |
| Fonts        | Orbitron + Rajdhani + JetBrains Mono (Google Fonts) |
| Hosting      | **Vercel** (any static host works)                  |

No state library, no router, no backend. The simulation is pure JS in `src/simulation/`.

## Architecture

```
src/
├── simulation/          # Pure logic — no React, no DOM
│   ├── constants.js     # Tile size, decay rates, palettes, building types
│   ├── random.js        # Seeded Mulberry32 PRNG + helpers
│   ├── names.js         # Unique name pool
│   ├── time.js          # In-game clock, daylight curve
│   ├── engine.js        # createWorld(), step()
│   ├── world/
│   │   ├── city.js          # Procedural map generator
│   │   ├── pathfinding.js   # A* over the tile grid
│   │   ├── weather.js       # Weather state machine
│   │   └── economy.js       # Economy, employment, crime indices
│   ├── events/
│   │   ├── eventBus.js      # Bounded log of timestamped events
│   │   └── randomEvents.js  # Robberies, lotteries, breakups, etc.
│   └── npc/
│       ├── factory.js       # createNpc()
│       ├── needs.js         # Hunger / energy / social decay & mood
│       ├── memory.js        # Bounded per-NPC event memory
│       ├── relationships.js # Interaction outcomes
│       └── ai.js            # Main decision / movement loop
├── render/
│   ├── camera.js        # Cinematic auto-pan + follow + event-focus
│   ├── particles.js     # Rain & ambient sparks
│   └── renderer.js      # Canvas painter + bakeCity offscreen cache
├── hooks/
│   ├── useSimulation.js # Owns world, RAF loop, throttled UI snapshot
│   └── useRenderer.js   # Canvas <-> renderer bridge
└── ui/                  # All React components
    ├── TopBar.jsx        LeftSidebar.jsx     CityViewport.jsx
    ├── BottomPanel.jsx   RightSidebar.jsx    SimControls.jsx
    ├── NpcCard.jsx       PanelHeader.jsx     Meter.jsx
    └── icons.jsx
```

The simulation is **decoupled from React**. `useSimulation` runs a fixed-timestep
loop in a `requestAnimationFrame` and hands the UI a throttled (6 Hz) snapshot,
so React re-renders cheaply while the canvas paints at 60 fps.

## Installation

**Requirements**

- Node.js **18+** (an `.nvmrc` pins to 20)
- Any modern browser

**Local development**

```bash
git clone https://github.com/sasakula/webiste.git
cd webiste
npm install
npm run dev
```

Visit http://localhost:5173 — the city is already alive on first load.

**Production build**

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4173
```

## Controls

| Key            | Action                          |
| -------------- | ------------------------------- |
| `Space`        | Pause / resume                  |
| `1` / `2` / `3` / `4` | Set speed (1x · 2x · 4x · 8x) |
| Click NPC card | Follow that agent with the camera |
| Click event row (with actor) | Follow the actor in that event |
| "release" chip | Return to cinematic mode        |

## Deployment

### Deploy to Vercel (one-click)

1. **Push this repo to GitHub** (already done if you cloned it).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Vite from `vercel.json`. Defaults are correct:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**. The site goes live within ~30 seconds.

`vercel.json` already includes:

- SPA rewrites (every route falls back to `index.html`)
- `Cache-Control: public, max-age=31536000, immutable` for hashed `/assets/*`
- Standard security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)

### Deploy elsewhere

The build output in `dist/` is a fully static site. It works on:

- **Netlify** — drop `dist/` or connect the repo (use `npm run build` + publish `dist`)
- **GitHub Pages** — push `dist/` to a `gh-pages` branch
- **Any VPS / nginx / Caddy** — serve `dist/` as static files; SPA fallback to `index.html`

Example minimal nginx block:

```nginx
server {
  listen 80;
  root /var/www/neolife/dist;
  index index.html;
  location / {
    try_files $uri /index.html;
  }
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

## Performance Notes

This was built to run smoothly on cheap VPS hosting and low-end laptops:

- **Static city is baked once** to an offscreen canvas. Each frame only blits
  the bake plus dynamic NPCs + lights + particles.
- Simulation runs on a **fixed 10 ticks/sec** timestep, scaled by speed; UI
  snapshots are throttled to **6 Hz** so React stays cheap.
- A* pathfinding is bounded to **800 nodes** per query with a binary min-heap.
- DPR is capped at **2x** to avoid wasted work on hi-DPI displays.
- Vite chunks `react-dom` and `framer-motion` separately so the app shell
  paints before motion code finishes streaming.
- No runtime CSS-in-JS, no router, no state library, no backend — minimal
  dependency surface.

Production gzip bundle: roughly **160 KB** for app + framework chunks combined.

## Roadmap

- Hot reload of the simulation seed without page refresh
- Save / load world to `localStorage`
- Optional WebSocket sync for shared livestream viewing
- Expanded crime types (chase, arrest, escape)
- Procedural billboard ads & in-world cosmetics

## Contributing

Issues and PRs are welcome. Keep modules small and pure; the simulation
folder must not depend on React or DOM globals.

## License

[MIT](./LICENSE) © 2026 NeoLife contributors
