# Synapex Developers — Project Overview

## About
A premium marketing/portfolio website for "Synapex Developers" — a software agency. Built with TanStack Start (SSR + file-based routing), React 19, Tailwind CSS v4, and Framer Motion.

## Tech Stack
- **Framework:** TanStack Start (SSR) with TanStack Router (file-based routing)
- **UI:** React 19 + Tailwind CSS v4 + Radix UI primitives + Framer Motion animations
- **Package Manager / Runtime:** Bun
- **Build Tool:** Vite 7 (via `@lovable.dev/vite-tanstack-config`)
- **Optional CMS:** Supabase (graceful fallback to hardcoded content when env vars missing)

## Project Structure
```
src/
  routes/           # File-based page routes (TanStack Router)
    __root.tsx      # App shell / root layout
    index.tsx       # Home page
    about.tsx, services.tsx, projects.tsx, pricing.tsx
    team.tsx, blog.tsx, blog.$slug.tsx, faq.tsx
    careers.tsx, contact.tsx, admin.tsx
  components/
    sections/       # Page sections (Hero, Services, Projects, Blog, etc.)
    ui/             # Reusable UI primitives (shadcn-style)
    Navbar.tsx, Footer.tsx, SiteLayout.tsx
  lib/
    content.ts      # Hardcoded fallback content
    useContent.ts   # Data hooks with Supabase + fallback
    admin.ts        # Admin auth helpers
  integrations/supabase/  # Supabase client, types, middleware
public/             # Static assets (logo, favicon)
supabase/           # Supabase config + migrations
```

## Admin Dashboard (`/admin`)
- Sidebar layout with navigation, Supabase status, sign out
- **Overview** — stats cards with counts per table
- **Content sections** — Services, Projects, Tech Stack, Clients, Testimonials, Team, Pricing, Blog Posts
  - Per-row **Visible/Hidden toggle** — hide any item from the frontend without deleting it
  - Image fields (`image_url`, `logo_url`, `avatar_url`) show Upload button + URL input (uses Supabase Storage `images` bucket)
- **Messages inbox** — contact form submissions with mark-read, reply via email, delete
- **Site Settings** — social links, contact info, footer tagline, hero text (stored in `site_content` table)
- Demo credentials: `mrfrankofc` / `1234`

## Key Files
- `src/lib/content.ts` — fallback data (used when Supabase not connected)
- `src/lib/useContent.ts` — data hooks; filters `visible !== false`, includes `saveSiteContentKey()`
- `src/components/Footer.tsx` — social links pulled from `useSiteContent()` dynamically
- `src/routes/admin.tsx` — full admin dashboard (sidebar layout, no SiteLayout wrapper)
- `supabase/migrations/` — SQL migrations including `visible` column + `site_content` table

## Dev Server
- Host: `0.0.0.0`, Port: `5000`
- Command: `bun run dev`
- `allowedHosts: true` configured in `vite.config.ts` for Replit proxy

## Scripts
- `bun run dev` — Start development server
- `bun run build` — Production build
- `bun run start` — Serve production build

## Optional Supabase Setup
Set these environment variables for the CMS/admin features:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Without them, the site renders using hardcoded fallback content from `src/lib/content.ts`.

## Deployment
- Target: Autoscale
- Build: `bun run build`
- Run: `bun run start`
