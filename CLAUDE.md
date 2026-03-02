# CLAUDE.md — Manganui Wedding App

## Project Overview
**Manganui** — Wedding Photo & Video Sharing App
React + Vite SPA. Supabase handles all backend (auth, database, storage). No custom server.

## Key Rules (NEVER Break)
- NEVER hardcode Supabase URLs or keys — always use `import.meta.env`
- NEVER commit `.env` to Git — it is in `.gitignore`
- NEVER push directly to main branch
- Always use the custom Supabase schema: `manganui` (set in supabaseClient.js)
- Always read from `import.meta.env.VITE_SUPABASE_PROJECT_URL` and `import.meta.env.VITE_SUPABASE_API_KEY`

## Tech Stack
- **Frontend:** React 19 + Vite 7
- **Routing:** React Router DOM v7
- **UI:** Bootstrap 5 + React Bootstrap + custom CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage) — schema: `manganui`
- **Styling:** Bootstrap + custom CSS in `index.css` + `style.scss`
- **Icons:** Feather Icons (react-feather)
- **Spinners:** react-spinners (ClockLoader)
- **Video:** FFmpeg.wasm (requires CORS headers — already configured)
- **Contact Form:** Formspree
- **Deployment:** Netlify (or Cloudflare Pages) — `_headers` and `_redirects` in `/public`

## Folder Structure
```
src/
  assets/
    components/     ← Reusable components
    pages/          ← Page-level components
  config/
    supabaseClient.js
  App.jsx           ← Routes + AppProvider
  main.jsx          ← Entry point
  index.css         ← Global styles + upload card styles
  style.scss        ← Gallery SCSS
```

## Supabase Schema: `manganui`
### Tables
**events**
- id (UUID PK), name, slug (unique), event_date, cover_image (nullable)
- watermark_enabled (bool, default true), status (enum: active|locked)
- created_at, updated_at

**posts**
- id (UUID PK), event_id (FK → events.id), name (guest name)
- message, photos (text[] — array of public URLs)
- is_pinned (bool), is_highlight (bool)
- reactions (JSONB — e.g. { heart: 12, cry: 5, love: 8, pray: 3 })
- created_at

### Storage
- Bucket: `manganui_photos` (public)
- Path: `{slug}/{timestamp}-{filename}`

## Routes
| Route | Component | Auth? |
|-------|-----------|-------|
| / | Home | No |
| /contact | Contact | No |
| /login | Login | No |
| /register | Register | No (disabled in nav) |
| /admin-dashboard | AdminDashboard | Yes (ProtectedRoute) |
| /event/:slug | EventPage | No |
| /create/:slug | Create | No |
| /about-us | AboutUs | No |
| /testing | Testing | No |
| /workerexample | WorkerExample | No |
| * | ErrorPage | No |

## Key Components
- **AppContext.jsx** — Global auth state (session, logout, loading). Use `useAppContext()` hook.
- **ProtectedRoute.jsx** — Wraps admin routes. Redirects to `/` if no session.
- **EventHeader.jsx** — Cover image + event name + date
- **ModalCreatePost.jsx** — Modal with upload toast notifications
- **Upload.jsx** — File upload (max 4 files, 60MB each, images+videos)
- **SmartImage.jsx** — Auto portrait/landscape detection
- **EventCarousel.jsx** — Carousel for multiple media items
- **AppNavbar.jsx** — Hidden on /event/* routes
- **Footer.jsx** — Shows "Enquire Here" button on /event/* routes only

## Design System
| Token | Value |
|-------|-------|
| Primary | #5A3E36 (Dark Brown) |
| Secondary | #F0E5DA (Warm Beige) |
| Body text | #6B4B3E |
| Gold accent | #c9a84c → #f5e193 → #c9a84c |
| Background | linear-gradient(180deg, #FDF6F0 0%, #F0E5DA 100%) |
| Card shadow | rgba(139, 90, 60, 0.10) |
| Fonts | Cormorant Garamond / Playfair Display (headings), Lato / Nunito (body) |

## Outstanding Payment / AI
- No outstanding payment logic (this is the wedding app, not tuition app)
- AI: Anthropic Claude API for caption suggestions and sentiment summary
- AI env var: `VITE_CLAUDE_API_KEY`

## Environment Variables Needed
```
VITE_SUPABASE_PROJECT_URL=
VITE_SUPABASE_API_KEY=
VITE_CLAUDE_API_KEY=
```

## What's Already Built
- Auth (login, register, logout, ProtectedRoute, AppContext)
- Admin Dashboard (lists events)
- Event Page (shows posts, carousel, create post modal)
- Create/Upload post (background upload to Supabase Storage + posts table insert)
- Home page (hero, 3 feature cards, CTA)
- Contact page (Formspree)
- Netlify deployment config (_headers, _redirects)
- CORS config for FFmpeg.wasm in vite.config.js
- Partner logos (MatTeko, BO555KU Motoring) in /public/images

## What Still Needs Building (v1.0)
- WelcomeSplash.jsx (sessionStorage — show once per session)
- CountdownTimer.jsx (live countdown to wedding date)
- EmojiReactions.jsx (heart/cry/love/pray — updates JSONB in Supabase)
- ShareButton.jsx (Web Share API + platform fallbacks)
- SaveButton.jsx (Canvas API watermark before download)
- SentimentSummary.jsx (Claude AI summary of guest messages)
- Lightbox.jsx (yet-another-react-lightbox — tap to zoom)
- QRCodeGenerator.jsx (qrcode.react — downloadable per event)
- Create Event form in Admin Dashboard
- Edit Event form
- Delete post (admin)
- Pin post (admin)
- Event status toggle (active/locked)
- Watermark toggle
- Scroll to top button
- Guest count display
- Confetti on submit (canvas-confetti)
- Post timestamps (date-fns)
- Welcome splash + name pre-fill from localStorage

## Watermark Logic
- Applied client-side via HTML5 Canvas API (SaveButton.jsx)
- If `watermark_enabled = true` on event → overlay Manganui logo on canvas before download
- If `watermark_enabled = false` (premium) → skip watermark
- No server processing needed

## User Preferences
- Do not hardcode any values — use env vars and constants
- MVP first, no over-engineering
- Always tell user what `.env` vars are needed when creating new features
- User manages their own Supabase project for development
- One task at a time
