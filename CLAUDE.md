# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run lint      # ESLint check
npm run preview   # Preview production build
npx playwright test          # Run E2E tests (requires dev server running)
npx playwright test --ui     # Run E2E tests with interactive UI
```

Requires `.env` with `VITE_API_URL` and `VITE_MAPBOX_TOKEN` (see `.env.example` for all vars).

---

## Architecture

**Entry flow:** `main.jsx` → `App.jsx` (prefetches artists, mounts `<StickyMusicPlayer />`) → `AppRouter.jsx` (lazy-loaded pages via `createBrowserRouter`)

**Routing** (`src/router/AppRouter.jsx`): Single `createBrowserRouter` prevents auth-change remounts. `RootLayoutSwitcher` picks `MainLayout` (guest) vs `UserLayout` (authenticated). `AuthProtectedRoute` gates `/home`, `/editprofile`, `/new-event`, `/chat` — waits for Zustand `_hasHydrated` before evaluating auth state.

**Styling:** Tailwind CSS 4 via `@tailwindcss/vite` Vite plugin — no `tailwind.config.js`. DaisyUI 5 component classes available. Framer Motion 12 for animations.

**Path alias:** `@` maps to `./src` (configured in `vite.config.js`).

---

## State (Zustand — `src/stores/`)

| Store | Purpose |
|---|---|
| `userStore` | Auth state (user + JWT token), persisted to localStorage; `_hasHydrated` prevents flash |
| `playerStore` | Sticky music player state, persisted (artist, queue, volume); see Player section |
| `postStore` | Feed posts/comments with optimistic updates |
| `uiStore` | Navbar visibility, lightbox |
| `searchStore` | Global search query/suggestions |
| `contentStore` | Artist/event data fetched on demand |
| `notificationStore` | In-app notifications |

---

## HTTP (`src/api/auth.js`)

Centralized Axios instance. Request interceptor injects `Bearer` token from `userStore`. Response interceptor calls `userStore.logout()` on 401 — this clears the session on expired/invalid tokens.

All API base URLs come from `src/config/env.js` — **never duplicate `import.meta.env.VITE_API_URL` inline elsewhere**.

---

## Real-time (`src/contexts/SocketContext.jsx`)

Manages Socket.io connection; connects only when a valid token is present in localStorage. Re-connects when `user` or `SOCKET_URL` change. Socket is exposed via `useSocket()` hook.

---

## Music Player Pipeline

```
playerStore.js
  └─ fetchDefaultSongs()       ← fetches variety queue from backend on first load
  └─ playSongs(artist, songs)  ← used by genre pages (pop, rock, rnb…)
  └─ playNext() / playPrevious()

useYouTubePlayer.js             ← manages YouTube IFrame API lifecycle
  └─ extracts YouTube IDs via src/utils/youtube.js (extractYouTubeID)
  └─ fallback video ID: dQw4w9WgXcQ

StickyMusicPlayer.jsx           ← draggable, minimizable player UI
  └─ portal-mounted to #music-player-root
  └─ reads/writes playerStore
```

Songs are stored with `streamUrl` pointing to YouTube URLs. The player **never uses HTML5 `<audio>`** — it embeds YouTube IFrame API.

**Fallback songs** (when backend is unavailable): royalty-free NCS tracks defined in `playerStore.js` `fetchDefaultSongs`. Do not replace these with copyrighted tracks — the app may be deployed publicly.

**Genre page players** (`src/components/Page*Component/MusicPlayerSection.jsx`): each genre has its own player section with a vinyl animation and top-tracks list. All share the same `playerStore`.

---

## Forms

`react-hook-form` + Zod schemas in `src/validations/`. Resolvers via `@hookform/resolvers/zod`.

---

## Known Gotchas

- `src/config/env.js` is the single source of truth for all env variables including `API_URL`, `SOCKET_URL`, `MAPBOX_TOKEN`, Cloudinary config. Import from here, never re-declare inline.
- `playerStore` uses Zustand `persist` — calling `playSongs()` on page load may restore a stale queue from localStorage. Check `_hasHydrated` before assuming fresh state.
- `useSearchData.js` batch-fetches every artist's detail on first navbar render to build a song search index. This triggers many API calls — do not call it outside the navbar search context.
- The `contentStore.getArtistsById` action currently fetches but does not commit to state (the `set` call is commented out). This is intentional — pages fetch their own artist data directly.

---

## Library Evaluation Mindset

Before adding any new dependency, check these in order:

1. **Can an existing dep do it?** Framer Motion covers most animation needs. Zustand covers state. date-fns is already installed — don't add dayjs/moment. react-hook-form + Zod covers forms — don't add Formik.
2. **Bundle size** — check bundlephobia.com. Prefer tree-shakeable packages.
3. **React 19 + Vite 8 compatibility** — verify the lib works with the exact versions in use (many older libs have SSR or concurrent-mode issues).
4. **Maintenance health** — last commit should be within 12 months; avoid packages with >200 unresolved issues and no recent activity.
5. **UI components** — default to DaisyUI 5 primitives. Only reach for headless-ui or radix-ui if DaisyUI's accessibility or composability is genuinely insufficient.
6. **Data fetching** — if caching/refetching logic across more than 2 hooks grows complex, migrate to TanStack Query rather than building custom cache layers.
7. **Decision comment** — if the library solves a non-obvious problem or works around a specific framework limitation, add a one-line comment above the import explaining why.

---

## Vercel Deployment Checklist

Before deploying:
- `npm run build` exits 0 with no errors
- `VITE_API_URL` set to production backend URL in Vercel env vars
- `VITE_MAPBOX_TOKEN` set in Vercel env vars
- No debug `console.log` left in `SocketContext`, `contentStore`, `NewEvent`, or `useSearchData`
- `npx playwright test` passes against local dev server
- Check browser Console tab for 401 errors after login flow
