# Synapex Developers — Project Overview

## Tech Stack
- **Framework**: TanStack Start (React + SSR) with TanStack Router (file-based routing)
- **Build**: Vite 7 via `@lovable.dev/vite-tanstack-config`
- **Package manager**: Bun
- **Styling**: Tailwind CSS v4 + custom CSS utilities (glass, stars, grid-bg, spotlight, text-fade)
- **Animations**: Framer Motion v12
- **Backend**: Supabase (optional — falls back gracefully if not configured)
- **Icons**: Lucide React + Simple Icons CDN for tech logos

## Project Structure
```
src/
  routes/           # TanStack file-based routes
    __root.tsx      # Root shell + 404 page
    index.tsx       # Home (/)
    about.tsx       # /about
    services.tsx    # /services
    projects.tsx    # /projects
    team.tsx        # /team
    pricing.tsx     # /pricing
    contact.tsx     # /contact
    admin.tsx       # /admin (CMS)
  components/
    Navbar.tsx      # Fixed navbar with glass background + Synapex logo
    Footer.tsx      # Footer with Synapex logo
    SiteLayout.tsx  # Navbar + main + Footer wrapper
    sections/       # Page section components
      Hero.tsx      # Hero with animated counter stats
      Services.tsx  # Service cards with bottom separator
      Technologies.tsx # Tech stack marquee with Simple Icons
      Projects.tsx  # Project cards with category gradients + tech icons
      Clients.tsx   # Client logos
      Testimonials.tsx # Testimonials
      CTA.tsx       # Call-to-action
  lib/
    content.ts      # Fallback content + iconMap
    useContent.ts   # Supabase-backed hooks with graceful fallback
    admin.ts        # Admin auth (hardcoded: mrfrankofc/darex)
  integrations/
    supabase/client.ts  # Supabase client (graceful null client if not configured)
public/
  synapex-logo.png  # Synapex logo (S icon, blue/purple glow)
```

## Running the App
```bash
bun run dev   # Dev server on port 5000
bun run build # Production build
```

## Key Design Decisions
- **Dark Starlink-inspired theme**: Pure black bg, white glass morphism, star fields
- **Supabase optional**: App works fully with fallback content when Supabase isn't configured
- **Admin credentials**: username `mrfrankofc`, password `darex` (hardcoded, client-side)
- **Tech icons**: Simple Icons CDN (`https://cdn.simpleicons.org/{slug}/ffffff`)
- **Counter animation**: Stats in Hero animate from 0 when scrolled into view

## Deployment
- Configured as static site: `bun run build` → `dist/client`
- Workflow: `bun run dev` → port 5000
