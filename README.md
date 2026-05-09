# 4B1K — Music Community Platform

> A social platform for music fans — discover artists, join the community, explore events, and chat in real time.

> [!WARNING]
> **Demo Version** — All songs and music content featured in this platform are used with permission from the respective rights holders. This project is for demonstration purposes only and is not intended for commercial use.

---

## Project Demo

<video src="../4B1K Presentation.mp4" controls width="100%">
  Your browser does not support the video tag.
</video>

---

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5-5A0EF8?logo=daisyui&logoColor=white&style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-5-433E38?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white&style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io&logoColor=white&style=flat-square)

---

## Features

- **Community Feed** — Create posts, comment, like, and share with other music fans
- **Artist Discovery** — Browse artists by genre: Pop, Rock, R&B, EDM, Entertainment, and more
- **Real-time Chat** — Personal and group chat rooms powered by Socket.io
- **Events & Map** — Discover nearby music events with Mapbox/Google Maps integration
- **Sticky Music Player** — Persistent music player across all pages
- **Authentication** — Local login/register + OAuth (Google, Facebook, Twitter)
- **Responsive Design** — Mobile-first layout with dedicated bottom navigation

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [4B1K backend](../backend) running locally

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env   # or create .env manually (see below)

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Environment Variables

Create a `.env` file in this directory:

```env
# Required
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Optional
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all source files |

---

## Project Structure

```
src/
├── api/          # Axios API calls (auth, artist, event)
├── components/   # Reusable UI components (chat, feed, navbar, etc.)
├── config/       # Constants, env exports, player config
├── contexts/     # React contexts (SocketContext)
├── hooks/        # Custom hooks (useArtistDetail, useIsMobile, etc.)
├── layouts/      # Page layout wrappers (MainLayout, UserLayout)
├── pages/        # Route-level page components
├── router/       # createBrowserRouter configuration
├── stores/       # Zustand state stores
├── utils/        # Helper utilities
└── validations/  # Zod form schemas
```

---

## Team

| Role | Name |
|---|---|
| Product Owner | Phansit Hadtakijwattana (Ben) |
| Backend Developer & Scrum Master | Benyapa Thonhongsa (Ben) |
| Frontend & UI/UX | Patipat Patlom (Best) |
| Frontend & UI/UX | Natanon Chaipromnaruepai (Bam) |
| Frontend | Kanokwan Panyareung (Kwan) |

---

## License

This project is developed as part of a team project. All rights reserved.
