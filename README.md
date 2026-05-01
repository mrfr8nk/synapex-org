# Synapex Developers — Official Website

Premium marketing and portfolio website for **Synapex Developers**, a software engineering studio based in Harare, Zimbabwe, building for the world.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + [Vite](https://vitejs.dev) 7 (SPA) |
| Routing | [TanStack Router](https://tanstack.com/router) (client-side, file-based) |
| Styling | Tailwind CSS v4, custom glass/star/grid utility classes |
| Animations | [Framer Motion](https://www.framer.com/motion/) v12 |
| Icons | [Lucide React](https://lucide.dev), [Simple Icons CDN](https://simpleicons.org) |
| Runtime | [Bun](https://bun.sh) |
| CMS / Database | [Supabase](https://supabase.com) (optional — graceful fallback) |
| Deployment | Render Static Site, Vercel, Cloudflare Pages, Replit |

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
- Blog Posts — write/edit/publish articles with markdown-style content
- **Visibility toggles** — show/hide any row from the live site
- **Image uploads** — upload directly to Supabase Storage
- **Messages inbox** — view/mark-read/reply to contact form submissions
- **Site Settings** — social links, footer text

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

App runs on **http://localhost:5173** (Vite default port).

---

## Supabase Setup (Optional)

The site works without Supabase — it uses fallback content. To enable the CMS:

1. Create a project at [supabase.com](https://supabase.com)
2. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   ```
3. Run the migrations in `supabase/migrations/` against your project.

### Required tables
- `services` — title, description, icon, sort_order, visible
- `projects` — title, category, description, image_url, tech[], live_url, github_url, sort_order, visible
- `tech_stack` — name, category, sort_order, visible
- `clients` — name, logo_url, website_url, sort_order, visible
- `testimonials` — name, role, quote, rating, avatar_url, sort_order, visible
- `team_members` — name, role, bio, image_url, twitter_url, linkedin_url, github_url, sort_order, visible
- `pricing_plans` — name, price, description, features[], is_popular, sort_order, visible
- `blog_posts` — title, slug, summary, content, author, category, image_url, published, created_at, visible
- `contact_messages` — name, email, phone, subject, message, created_at, read
- `site_content` — key, value (for social links & footer text)

### Supabase Storage (for image uploads in admin)
1. In your Supabase dashboard → **Storage** → Create a bucket named exactly `images`
2. Set the bucket to **Public**
3. Add a policy to allow uploads (anon or authenticated, as needed)

Then in the admin at `/admin`, image fields will show an **Upload** button alongside the URL input.

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
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── Services.tsx
│   │   ├── Clients.tsx
│   │   ├── Technologies.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Process.tsx
│   │   ├── Projects.tsx
│   │   ├── Blog.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Newsletter.tsx
│   │   └── CTA.tsx
│   ├── FadeIn.tsx        # Scroll animation wrapper
│   ├── Navbar.tsx        # Glass nav with More dropdown
│   ├── Footer.tsx        # Dynamic footer with social links
│   └── SiteLayout.tsx    # Page wrapper
├── lib/
│   ├── content.ts        # All fallback data
│   ├── useContent.ts     # Supabase hooks with fallback
│   └── admin.ts          # Admin auth helpers
├── main.tsx              # React app entry point
├── router.tsx            # TanStack Router config
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

This is a **pure static SPA** (no server required). The built output is a `dist/` folder with an `index.html` and assets. All routing is handled client-side by TanStack Router.

> **Important for deep links & page refreshes:** Static hosts must redirect all paths to `/index.html` (returning HTTP 200) so TanStack Router can handle routing. Configure this rewrite rule on whichever host you use.

---

### Deploy on Render (Recommended)

1. Push your code to GitHub / GitLab.
2. Go to [render.com](https://render.com) → **New** → **Static Site**.
3. Connect your repository.
4. Fill in the settings:

   | Setting | Value |
   |---|---|
   | **Build Command** | `npm install -g bun && bun install && bun run build` |
   | **Publish Directory** | `dist` |

5. Under **Redirects/Rewrites**, add a rule:

   | Source | Destination | Action |
   |---|---|---|
   | `/*` | `/index.html` | **Rewrite** (200) |

6. Under **Environment Variables**, add these if using Supabase:

   | Variable | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `your-anon-key` |

7. Click **Create Static Site**. Render will build and deploy automatically.

---

### Deploy on Vercel

Vercel auto-detects Vite. Just push to GitHub and import the repo on Vercel.

Add a `vercel.json` for SPA routing (deep links):
```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

---

### Deploy on Cloudflare Pages

1. Connect your repo in the Cloudflare Pages dashboard.
2. Build command: `bun install && bun run build`
3. Output directory: `dist`
4. Add a `_redirects` file inside the `public/` folder:
   ```
   /* /index.html 200
   ```

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
