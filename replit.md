# Synapex Organisation

A modern React + Vite SPA for Synapex Developers — a software agency website showcasing services, projects, team, pricing, and more.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Backend/Auth**: Supabase
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Package Manager**: npm (bun lockfile present but npm used in Replit)

## Project Structure

```
src/
  components/   - Shared UI components
  hooks/        - Custom React hooks
  integrations/ - Supabase client setup
  lib/          - Utility functions
  routes/       - File-based TanStack Router pages
  main.tsx      - App entry point
  router.tsx    - Router configuration
  styles.css    - Global styles
public/         - Static assets
supabase/       - Supabase config/migrations
```

## Pages / Routes

- `/` — Home (hero, features, etc.)
- `/about` — About page
- `/services` — Services offered
- `/projects` — Portfolio/projects
- `/blog` — Blog listing
- `/blog/$slug` — Blog post detail
- `/pricing` — Pricing plans
- `/contact` — Contact form
- `/team` — Team members
- `/faq` — FAQ
- `/careers` — Careers
- `/sponsors` — Sponsors
- `/join` — Join page
- `/dashboard` — Dashboard (authenticated)
- `/admin` — Admin panel

## Environment Variables

Configured in `.env`:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Build for production (outputs to dist/)
npm run lint   # Run ESLint
```

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `dist`
