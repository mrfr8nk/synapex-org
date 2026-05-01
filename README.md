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
| Deployment | Render (recommended), Replit |

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
Demo Credentials: `mrfrankofc` / `1234`

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

> **Why no 404 on refresh here?**
> This is a TanStack Start **SSR** app — every page request (including refreshes and deep links) hits the server, which handles routing. The 404-on-refresh problem only happens with pure client-side SPAs on static hosts. Since this app runs a real server, that problem doesn't exist.

---

### Deploy on Render (Recommended — easiest, works out of the box)

> **What caused the blank white screen?** The original start command used `bun --env-file=.env` which fails on Render because there is no `.env` file — Render injects env vars directly. This is now fixed; the start command is just `bun dist/server/server.js`.

1. Push your code to GitHub / GitLab.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your repository.
4. Fill in the settings:

   | Setting | Value |
   |---|---|
   | **Environment** | `Node` |
   | **Build Command** | `npm install -g bun && bun install && bun run build` |
   | **Start Command** | `bun dist/server/server.js` |

5. Under **Environment Variables**, add these:

   | Variable | Value | Required |
   |---|---|---|
   | `PORT` | `5000` | **Yes** — tells Render which port your server listens on |
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | No (optional CMS) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `your-anon-key` | No (optional CMS) |

6. Click **Create Web Service**. Render will build and deploy automatically.

That's it. Refreshes, deep links, and all routes work correctly because Render runs the SSR server.

#### Supabase Storage (for image uploads in admin)
1. In your Supabase dashboard → **Storage** → Create a new bucket named exactly `images`
2. Set the bucket to **Public**
3. Go to **Policies** and allow authenticated or anon uploads as needed

Then in the admin at `/admin`, image fields will show an **Upload** button alongside the URL input.

---

### Deploy on Vercel (Requires extra setup)

> **Important:** Vercel does NOT work out of the box with this project. TanStack Start needs a Vercel-specific adapter to convert the SSR output into Vercel serverless functions. The current build targets a Bun/Node server, not Vercel's format.
>
> If you want Vercel, **Render is a much simpler choice** for TanStack Start apps.

If you still want Vercel, here's what you'd need to do:

1. Install the Vercel adapter:
   ```bash
   bun add @tanstack/react-start-adapter-vercel
   ```
2. Update `vite.config.ts` to use the Vercel adapter instead of the default one.
3. Add a `vercel.json` with rewrites so all paths route through the server function:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/api/server" }]
   }
   ```
4. Follow the [TanStack Start Vercel adapter docs](https://tanstack.com/router/latest/docs/framework/react/start/hosting) for the exact configuration.

This is significantly more work. **Render is the recommended path.**

---

### Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | No | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | No | Your Supabase anon/public key |

Without Supabase vars, the site renders using built-in fallback content — no errors, no blank pages.

---

Production URL: [synapex.co.zw](https://synapex.co.zw)

---

## License

Proprietary. All rights reserved — Synapex Developers © 2026.

---

*Built in Harare → shipped to the world.*
