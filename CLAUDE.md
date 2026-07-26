# CLAUDE.md

This file documents the niki-portfolio project for Claude Code.

---

## Project Overview

An underwater aquarium-themed React portfolio. Navigation is driven entirely by clicking animated sea creatures — there is no traditional nav bar on the home screen. Each creature floats with idle GSAP animations, plays a sound on hover/click, runs an exit animation, then routes to a content page.

Live site: deployed to GitHub Pages via the `gh-pages` branch.

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| Vite | latest | Dev server & build tool |
| react-router-dom | 7.14.1 | Routing (HashRouter — required for GitHub Pages) |
| GSAP | 3.15.0 | All animations (idle loops + click exits) |
| use-sound | 5.0.0 | Audio playback (wraps Howler.js) |
| gh-pages | latest | Deploy to GitHub Pages |

---

## Commands

```bash
npm run dev        # start Vite dev server (HMR)
npm run build      # production build → dist/
npm run preview    # preview production build locally
npm run lint       # ESLint
npm run deploy     # build + push to gh-pages branch (LIVE SITE)
```

No test suite is configured.

---

## Folder Structure

```
niki-portfolio/
├── public/
│   ├── creatures/          # all creature & fish PNG sprites
│   ├── sounds/             # all .wav and .mp3 audio files
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── creatures/      # one file per clickable creature
│   │   │   ├── Jellyfish.jsx
│   │   │   ├── Starfish.jsx
│   │   │   ├── TreasureChest.jsx
│   │   │   ├── Turtle.jsx
│   │   │   └── PufferFish.jsx
│   │   ├── AquariumScene.jsx   # home screen: SVG scene + creature layout
│   │   ├── HamburgerMenu.jsx   # fixed right-side panel (persists all routes)
│   │   └── SideNav.jsx         # icon nav used on content pages
│   ├── contexts/
│   │   └── SoundContext.jsx    # global music/SFX/volume state
│   ├── pages/
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── About.jsx
│   │   ├── Certificates.jsx
│   │   └── Hobbies.jsx
│   ├── App.jsx             # routes + SoundProvider wrapper
│   ├── App.css             # all styles (one file — do not split)
│   └── main.jsx
├── CLAUDE.md
├── package.json
└── vite.config.js
```

---

## Creature Components

All creatures follow the same structural pattern:
- `posRef` — outer div; receives the click-exit GSAP animation, then calls `navigate()`
- `animRef` — inner div; holds the idle GSAP loop (float/rock/sway)
- `clickedRef = useRef(false)` — guards against double-navigation on fast clicks
- Frame cycling with `setInterval` for flipbook sprites
- `useSound` hook for audio; always checks `isSfxMuted` before calling play

---

### Jellyfish → `/projects`

**File:** `src/components/creatures/Jellyfish.jsx`

**Position (AquariumScene.jsx:458):** `left: 48%, top: 30%`

**Images:**
- `public/creatures/jelly1.png` — frame 1
- `public/creatures/jelly2.png` — frame 2
- `public/creatures/jelly3.png` — frame 3
- Rendered at `width={260}`

**Animations:**
- **Flipbook:** 3 frames, cycles 1→2→3→1 every 600ms via `setInterval`
- **Float (idle):** Y axis, -7px → +8px, 1.5s, `sine.inOut`, yoyo repeat -1
- **Sway (idle):** X axis, -8px → +8px, 2s, `sine.inOut`, yoyo repeat -1
- **Click exit:** kills idle tweens, flies `posRef` up `-(window.innerHeight + 300)px`, 1.1s, `power2.in`, then navigates

**Sounds:**
- Hover: `bubble small.wav` at vol 0.5
- Click: `bubble long.wav` at vol 0.7

**Tooltip color:** `rgba(220, 190, 255, 0.95)` (purple)
**Hover glow:** `drop-shadow(0 0 22px rgba(200, 140, 255, 0.9))`

---

### Starfish → `/skills`

**File:** `src/components/creatures/Starfish.jsx`

**Position (AquariumScene.jsx:459):** `left: 18%, top: 38%`

**Images:**
- `public/creatures/star1.png` — frame 1
- `public/creatures/star2.png` — frame 2
- `public/creatures/star3.png` — frame 3
- Rendered at `width={100}`

**Animations:**
- **Flipbook:** 3 frames, cycles 1→2→3→1 every 800ms
- **Rock (idle):** rotation -7° → +7°, 2.5s, `sine.inOut`, yoyo repeat -1, `transformOrigin: '50% 90%'`
- **Click exit:** kills idle tweens, spins 360° + flies `posRef` up `-(window.innerHeight + 200)px`, 1.0s, `power2.in`, then navigates

**Sounds:**
- Hover: `chime.wav` at vol 0.5
- Click: `chime.wav` at vol 0.8

**Tooltip color:** `rgba(255, 200, 140, 0.95)` (orange)
**Hover glow:** `drop-shadow(0 0 20px rgba(255, 160, 60, 0.9))`

---

### TreasureChest → `/about`

**File:** `src/components/creatures/TreasureChest.jsx`

**Position (AquariumScene.jsx:462):** `left: 78%, top: 78%, transform: translateX(-50%)`

**Images:**
- `public/creatures/treasure_closed.png` — default/idle state
- `public/creatures/treasure_open.png` — hover state (src switches on `open` state)
- Rendered at `width={160}`

**Animations:**
- **Bob (idle):** Y axis, -5px → +5px, 2.2s, `sine.inOut`, yoyo repeat -1
- **Click exit:** pulses `posRef` scale 1.0 → 1.25 → 1.0, 0.18s yoyo repeat 1, `power2.out`, then navigates
- No fly-off — chest stays in place and pulses

**Sounds:**
- Hover: `treasure.wav` at vol 0.7
- Click: `treasure.wav` at vol 1.0

**Tooltip color:** `rgba(255, 218, 140, 0.95)` (gold)
**Hover glow:** `drop-shadow(0 0 22px rgba(255, 200, 60, 0.9))`

---

### Turtle → `/certificates`

**File:** `src/components/creatures/Turtle.jsx`

**Position (AquariumScene.jsx:461):** `left: 22%, top: 70%`

**Images:**
- `public/creatures/turtle_shell.png` — frame 1 (idle)
- `public/creatures/turtle_both.png` — frame 2 (legs out)
- Rendered at `width={250}`

**Animations:**
- **Flipbook:** 2 frames toggling every 1200ms; managed via `intervalRef` (start/stop functions)
- **Rock (idle):** rotation -4° → +4°, 3.5s, `sine.inOut`, yoyo repeat -1, `transformOrigin: '50% 90%'`
- **Hover:** stops flipbook interval, locks to frame 2, scales `posRef` to 1.15 (0.3s, `power2.out`)
- **Mouse leave:** scales back to 1, restarts flipbook (unless already clicked)
- **Click exit:** pulses `posRef` scale 1.0 → 1.2 → 1.0, 0.15s yoyo repeat 1, then navigates

**Sounds:**
- Hover: `chime.wav` at vol 0.5
- Click: no sound

**Tooltip color:** `rgba(160, 255, 200, 0.95)` (green)
**Hover glow:** `drop-shadow(0 0 18px rgba(60, 220, 120, 0.85))`

---

### PufferFish → `/hobbies`

**File:** `src/components/creatures/PufferFish.jsx`

**Position (AquariumScene.jsx:460):** `left: 82%, top: 58%`

**Images:**
- `public/creatures/puffer1.png` — puffed / big state
- `public/creatures/puffer2.png` — deflated / small state

**Size constants:**
- `SMALL = 120` (px) — deflated
- `BIG = 220` (px) — puffed
- Size applied via inline style with `transition: width 0.5s ease, height 0.5s ease`

**Animations:**
- **Auto-inflate cycle:** alternates big (frame 1) ↔ small (frame 2) every 3000ms via `intervalRef`
- **Rock (idle):** rotation -5° → +5°, 3s, `sine.inOut`, yoyo repeat -1, `transformOrigin: '50% 90%'`
- **Hover:** stops interval, locks to frame 1 (puffed / BIG), plays sound
- **Mouse leave:** restores frame 2 (small), restarts interval (unless clicked)
- **Click exit:** sets frame 1 + puffed, navigates after 400ms timeout (no GSAP exit)

**Sounds:**
- Hover: `bubble deep.wav` at vol 0.6
- Click: no sound

**Tooltip color:** `rgba(255, 220, 130, 0.95)` (golden)
**Hover glow:** `drop-shadow(0 0 15px rgba(255, 200, 100, 0.9))`

---

### Seaweed Click Area → `/hobbies`

**Defined in:** `AquariumScene.jsx:464–476` (not a separate component)

**Position:** `left: 0%, top: 40%, width: 14%, height: 55%` (transparent button over left seaweed)

**Images:** None — it's an invisible `<button>` layered over the SVG seaweed strokes

**Animation:** SVG seaweed strokes animate independently in AquariumScene (rotation sway from `transformOrigin: '50% 100%'`; duration formula `2.0 + i * 0.22s`, alternating directions). Strokes turn bright green (`#2ecc71`) with glow on hover via `seaweedGlowing` state.

**Sounds:** None

**Tooltip color:** `rgba(80, 230, 140, 0.95)` (bright green)

---

## Creature Positions (do not change unless asked)

These are the exact `left` / `top` values set in `AquariumScene.jsx:458–462`:

| Creature | left | top | notes |
|---|---|---|---|
| Jellyfish | 48% | 30% | |
| Starfish | 18% | 38% | |
| PufferFish | 82% | 58% | |
| Turtle | 22% | 70% | |
| TreasureChest | 78% | 78% | also has `transform: translateX(-50%)` |
| Seaweed button | 0% | 40% | width: 14%, height: 55% |

All creature `position` divs use `transform: translate(-50%, -50%)` via CSS so `left`/`top` are center-anchored.

---

## Sound System

**Context file:** `src/contexts/SoundContext.jsx`

**Provider:** `<SoundProvider>` wraps the entire app in `App.jsx`. Uses `Howler.volume(volume)` to sync global volume.

**Context shape:**
```js
{
  isMusicMuted: boolean,   // controls ambient background music
  isSfxMuted:   boolean,   // controls all creature SFX
  volume:       number,    // 0–1, applied globally via Howler
  toggleMusic:  () => void,
  toggleSfx:    () => void,
  setVolume:    (n) => void,
}
```

**Ambient music:** `underwater background.mp3`, vol 0.3, loop. Starts on first user click to satisfy browser autoplay policy. Managed in `AquariumScene.jsx` with `ambientStarted` and `ambientPlaying` refs.

**SFX pattern in every creature:**
```js
const { isSfxMuted } = useSoundCtx()
const [playHover] = useSound(`${BASE}sounds/file.wav`, { volume: 0.5, interrupt: true })
// in handler:
if (!isSfxMuted) playHover()
```

**Sound file → usage map:**

| File | Used by | Event | Volume |
|---|---|---|---|
| `underwater background.mp3` | AquariumScene | ambient loop | 0.3 |
| `bubble small.wav` | Jellyfish | hover | 0.5 |
| `bubble long.wav` | Jellyfish | click | 0.7 |
| `bubble deep.wav` | PufferFish | hover | 0.6 |
| `chime.wav` | Starfish | hover | 0.5 |
| `chime.wav` | Starfish | click | 0.8 |
| `chime.wav` | Turtle | hover | 0.5 |
| `treasure.wav` | TreasureChest | hover | 0.7 |
| `treasure.wav` | TreasureChest | click | 1.0 |
| `cartoon bubble.wav` | fish school groups | hover/click | — |

The file `Underwater Sound Effects Library (1).mp3` in `public/sounds/` is unused.

---

## Asset Paths

All `src` values for images and sounds must use `import.meta.env.BASE_URL`:

```js
const BASE = import.meta.env.BASE_URL
// correct:
src={`${BASE}creatures/jelly1.png`}
src={`${BASE}sounds/bubble small.wav`}
```

Omitting `BASE` breaks assets in production (GitHub Pages serves from `/niki-portfolio/` subdirectory, not `/`).

---

## Routing

`HashRouter` is required — GitHub Pages has no server-side routing support.

```
/             → Home (AquariumScene)
/projects     → Projects.jsx
/skills       → Skills.jsx
/about        → About.jsx
/certificates → Certificates.jsx
/hobbies      → Hobbies.jsx
```

`HamburgerMenu` sits outside `<Routes>` in `App.jsx` so it persists on every page.

---

## Known Issues & Fixes

- **Ambient music doesn't start automatically** — this is intentional, not a bug. Browser autoplay policy blocks audio before user interaction. Music starts on first click anywhere on the scene.
- **PufferFish has no `posRef`** — unlike other creatures, PufferFish does not use a `posRef` for its click exit. It uses `setTimeout(() => navigate('/hobbies'), 400)` directly instead of a GSAP exit on an outer ref.
- **TreasureChest has a custom transform** — it uses `transform: translateX(-50%)` in `style` instead of the full `translate(-50%, -50%)` that other creatures get from CSS. This is intentional for its bottom-seated placement.
- **`Underwater Sound Effects Library (1).mp3`** in `public/sounds/` is an unused file (leftover asset).

---

## Rules — Do Not Change Without Being Asked

1. **Do not move creatures.** The `left`/`top` values in `AquariumScene.jsx` are intentional and visually balanced. Never adjust positions unless the user explicitly asks.
2. **Do not add glow effects.** Each creature already has a precisely tuned drop-shadow glow on hover. Do not add glow to idle state, to tooltips, or anywhere not already glowing.
3. **Do not split App.css.** All styles live in one file by design. Do not extract creature styles into separate CSS files.
4. **Do not change the router type.** `HashRouter` is required for GitHub Pages. Do not switch to `BrowserRouter`.
5. **Do not add the `BASE_URL` prefix to relative imports** — only to `src` attributes for files in `public/`.
6. **Do not add comments explaining what code does** — only add a comment if the WHY is non-obvious (hidden constraint, subtle invariant, known workaround).
7. **Do not add features not asked for** — no new pages, no new creatures, no new sounds unless requested.

---

## Adding a New Creature / Page

1. Add PNG sprite(s) to `public/creatures/`
2. Add sound to `public/sounds/` if needed
3. Create `src/components/creatures/MyCreature.jsx` following the `posRef` / `animRef` / `clickedRef` pattern
4. Add a `<Route>` in `App.jsx` and a page component in `src/pages/`
5. Place the creature in `AquariumScene.jsx` inside `.creatures-layer`
6. Update `HamburgerMenu.jsx` (add to `GUIDE` array and `QUICK_LINKS`) and `SideNav.jsx` (`NAV_ITEMS`)
