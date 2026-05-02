# Synapex Organisation

A modern React + Vite SPA for Synapex Developers — a software agency website with full CMS admin panel, Supabase backend, GitHub/Google/SMTP-magic-link auth, dynamic content, image uploads, and a developer network with profile pages.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Backend/Auth**: Supabase (auth + DB + edge functions)
- **Animations**: Framer Motion v12
- **Package Manager**: npm

## Project Structure

```
src/
  components/   - Shared UI components (sections, layout, etc.)
  hooks/        - Custom React hooks
  integrations/ - Supabase client setup
  lib/          - Utility functions (admin auth, content, etc.)
  routes/       - File-based TanStack Router pages
  styles.css    - Global styles (marquee animations etc.)
supabase/
  functions/    - Edge functions (send-magic-link, verify-magic-link)
  migrations/   - SQL migrations
SYNAPEX_SUPABASE_SETUP.sql  - Full DB setup (run once in Supabase SQL editor)
```

## Pages / Routes

- `/` — Home
- `/about` — About
- `/services` — Services
- `/projects` — Portfolio
- `/blog` — Blog listing
- `/blog/$slug` — Blog post detail
- `/pricing` — Pricing plans
- `/contact` — Contact form
- `/team` — Developer network / team members
- `/faq` — FAQ
- `/careers` — Careers
- `/sponsors` — Sponsors + sponsor application
- `/join` — Join page (GitHub OAuth, Google OAuth, SMTP magic link)
- `/dashboard` — Authenticated developer dashboard
- `/admin` — Admin CMS panel (password-protected)

## Key Features

### Authentication
- GitHub OAuth, Google OAuth via Supabase
- SMTP magic link via custom edge function (`send-magic-link`) using denomailer
- Verify edge function (`verify-magic-link`) creates real Supabase sessions
- GitHub avatar auto-fetched from profile GitHub URL (no OAuth required)
- Admin login: password-based via `@/lib/admin` (NOT Supabase auth)

### Developer Dashboard (tabbed)
- **Overview**: Profile card (name, bio, location, GitHub, portfolio, skills), edit form with GitHub avatar auto-detection, stats row
- **Projects**: Open projects to apply to, pending applications, accepted (active) projects with "Post update" button for collaborator progress notes
- **My posts**: List of blog posts the user has submitted (with pending/published status)
- **Write post**: Full blog post editor (title, summary, content markdown, category, cover image) — submits for admin review

### Admin Panel (`/admin`, login: `mrfrankofc` / `1234`)
- CMS for all tables: events, services, projects, tech_stack, clients, testimonials, team_members, pricing_plans, blog_posts
- **Blog posts**: Pending user submissions show amber "⏳ Pending review" badge + green "Approve & Publish" one-click button
- **Projects**: `is_open` toggle to mark projects as open for collaborators; Join requests panel below projects list with Accept/Decline buttons
- **Events**: Type dropdown (update/news/event/announcement/achievement)
- Site Settings with SMTP helper, social links, hero text, etc.
- Image upload via ImageInput component (Supabase Storage or URL)

### Project Collaboration
- Admin marks projects `is_open=true`
- Developers apply from dashboard with optional message
- Admin accepts/declines from Projects tab join-requests panel
- Accepted collaborators can post progress updates from dashboard

### Blog Submissions
- Users write posts in dashboard → `published=false, pending_approval=true`
- Admin sees amber badge in blog_posts tab → clicks "Approve & Publish" → live on site
- Slug auto-generated from title + timestamp

## Database Tables (Supabase)

Core: `site_content`, `services`, `projects`, `tech_stack`, `clients`, `testimonials`, `team_members`, `pricing_plans`, `blog_posts`, `events`

Auth/users: `developer_profiles`, `magic_link_tokens`

Community: `project_collaborators`, `project_updates`

Comms: `contact_messages`, `sponsor_applications`, `newsletter_subscribers`, `sponsors`

Misc: `hidden_fallbacks`

## SQL Migrations (run in order in Supabase SQL editor)

1. `SYNAPEX_SUPABASE_SETUP.sql` — full base schema + RLS policies
2. `supabase/migrations/20260502220000_project_collaborators.sql` — `project_collaborators` table + `is_open`/`open_roles` on projects
3. `supabase/migrations/20260502230000_blog_submissions.sql` — `pending_approval`/`submitted_by_user_id` on blog_posts + `project_updates` table

## Environment Variables

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key

## Edge Function Secrets (Supabase Dashboard → Edge Functions → Secrets)

- `SMTP_HOST` — e.g. `smtp.gmail.com`
- `SMTP_PORT` — e.g. `587`
- `SMTP_USER` — your email address
- `SMTP_PASS` — app password
- `SMTP_FROM` — sender display email

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Build for production
```

## Deployment

Deployed at: `synapex.gleeze.com` and `synapex.co.zw`
Static deployment — build command: `npm run build`, public dir: `dist`
