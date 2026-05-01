# Synapex Developers — Official Website

Premium marketing and portfolio website for **Synapex Developers**, a software engineering studio based in Harare, Zimbabwe, building for the world.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR + file-based routing) |
| UI | React 19, [TanStack Router](https://tanstack.com/router) |
| Styling | Tailwind CSS v4, custom glass/star/grid utility classes |
| Animations | [Framer Motion](https://www.framer.com/motion/) v12 |
| Icons | [Lucide React](https://lucide.dev), [Simple Icons CDN](https://simpleicons.org) |
| Runtime | [Bun](https://bun.sh) |
| Build | [Vite](https://vitejs.dev) 7 |
| CMS / Database | [Supabase](https://supabase.com) (optional — graceful fallback) |
| Deployment | Replit Autoscale |

---

## Features

### Pages
- **Home** `/` — Hero, Stats counter, Services, Clients, Why Us, Tech stack marquee, Process, Projects, Blog preview, Testimonials, Newsletter, CTA
- **About** `/about` — Company story, values, team preview
- **Services** `/services` — Full service listing with icons
- **Work** `/projects` — Portfolio grid with category gradients and tech icons
- **Pricing** `/pricing` — Tiered pricing plans with feature lists
- **Team** `/team` — Expanded team section with specialties
- **Blog** `/blog` — Article listing with category filters
- **Blog Post** `/blog/$slug` — Individual post with markdown-style content rendering
- **FAQ** `/faq` — Animated accordion Q&A
- **Careers** `/careers` — Open positions with location, type, salary
- **Contact** `/contact` — Contact form (writes to Supabase or logs fallback)
- **Admin** `/admin` — Password-protected CMS (see below)

### Design System
- Pure black background with subtle star field and grid overlay
- Glass morphism cards (`glass`, `glass-strong`, `glass-nav` utilities)
- Animated gradient text (`text-fade`) on all headings
- Scroll-triggered reveal animations (left/right/up alternating by section)
- Dual-row marquee for tech stack icons (both directions)
- Animated stats counter (counts up on scroll into view)
- Responsive navbar with "More" dropdown for secondary links
- Mobile-first — fully responsive at all breakpoints

### Admin CMS (`/admin`)
Credentials: `mrfrankofc` / `darlex`

Manage all site content when Supabase is connected:
- Services, Projects, Tech Stack, Clients
- Testimonials, Team Members, Pricing Plans
- **Blog Posts** (new) — write/edit/publish articles with markdown-style content

When Supabase is not configured, the site renders high-quality fallback content automatically — no blank pages.

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) >= 1.0

### Install & run locally
```bash
bun install
bun run dev
```

App runs on **http://localhost:5000**

---

## Supabase Setup (Optional)

The site works without Supabase — it uses fallback content. To enable the CMS:

1. Create a project at [supabase.com](https://supabase.com)
2. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   ```
3. Create tables matching the fallback schema in `src/lib/content.ts`

### Required tables
- `services` — title, description, icon, sort_order
- `projects` — title, category, description, image_url, tech[], live_url, github_url, sort_order
- `tech_stack` — name, category, sort_order
- `clients` — name, logo_url, website_url, sort_order
- `testimonials` — name, role, quote, rating, avatar_url, sort_order
- `team_members` — name, role, bio, image_url, twitter_url, linkedin_url, github_url, sort_order
- `pricing_plans` — name, price, description, features[], is_popular, sort_order
- `blog_posts` — title, slug, summary, content, author, category, image_url, published, created_at
- `contact_messages` — name, email, phone, subject, message, created_at, read

---

## Project Structure

```
src/
├── routes/               # TanStack Router pages (file-based)
│   ├── index.tsx         # Home page
│   ├── blog.tsx          # Blog listing
│   ├── blog.$slug.tsx    # Individual blog post
│   ├── faq.tsx           # FAQ accordion
│   ├── careers.tsx       # Open positions
│   ├── admin.tsx         # CMS admin portal
│   └── ...
├── components/
│   ├── sections/         # All page sections
│   │   ├── Hero.tsx      # Landing hero
│   │   ├── Stats.tsx     # Animated metrics
│   │   ├── Services.tsx  # Service cards
│   │   ├── Clients.tsx   # Client logos (Simple Icons)
│   │   ├── Technologies.tsx  # Dual-row marquee
│   │   ├── WhyUs.tsx     # Differentiators
│   │   ├── Process.tsx   # 5-step process
│   │   ├── Projects.tsx  # Portfolio grid
│   │   ├── Blog.tsx      # Blog preview
│   │   ├── Testimonials.tsx
│   │   ├── Newsletter.tsx
│   │   └── CTA.tsx
│   ├── FadeIn.tsx        # Scroll animation wrapper
│   ├── Navbar.tsx        # Glass nav with More dropdown
│   ├── Footer.tsx        # Site footer
│   └── SiteLayout.tsx    # Page wrapper
├── lib/
│   ├── content.ts        # All fallback data
│   ├── useContent.ts     # Supabase hooks with fallback
│   └── admin.ts          # Admin auth helpers
└── styles.css            # Tailwind + custom utilities
```

---

## Brand

- **Primary font**: System UI stack (Inter-style)
- **Color palette**: Pure black `#000000` with white `#ffffff` at varying opacities
- **Logo**: `/public/synapex-logo.png` (the S mark)
- **Tagline**: *African innovation, global standards.*

---

## Deployment

Deployed via [Replit Autoscale](https://replit.com). The `dist/` output is served as a static site with SSR entrypoint.

Production URL: [synapex.replit.app](https://synapex.replit.app)

---

## License

Proprietary. All rights reserved — Synapex Developers © 2025.

---

*Built in Harare → shipped to the world.*
