# Synapex Developers — Official Website

Premium marketing, portfolio and community website for **Synapex Developers**, a software engineering studio based in Harare, Zimbabwe, building for the world.

Live at **[synapex.co.zw](https://synapex.co.zw)** and **[synapex.gleeze.com](https://synapex.gleeze.com)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + [Vite](https://vitejs.dev) 7 (SPA) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based, client-side) |
| Styling | Tailwind CSS v4 + custom glass/star/grid utilities |
| Animations | [Framer Motion](https://www.framer.com/motion/) v12 |
| Icons | [Lucide React](https://lucide.dev) |
| Backend / DB | [Supabase](https://supabase.com) — Postgres + Auth + Storage |
| Auth | Google OAuth, GitHub OAuth, SMTP magic-link (denomailer) |
| Runtime | [Bun](https://bun.sh) |
| Deployment | Render Static Site / Vercel / Cloudflare Pages |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Stats, Events feed, Services, Clients, Why Us, Tech stack, Process, Projects, Blog, Testimonials, Sponsors, Newsletter, CTA |
| `/about` | Company story, values, team preview |
| `/services` | Full service listing |
| `/projects` | Portfolio grid with category gradients & tech chips |
| `/pricing` | Tiered pricing plans |
| `/team` | Core team cards + developer network grid (OAuth avatars) |
| `/blog` | Article listing with category filters |
| `/blog/$slug` | Individual post with markdown-style rendering |
| `/sponsors` | Sponsor tiers + application form (saves to Supabase) |
| `/faq` | Animated accordion Q&A |
| `/careers` | Open positions |
| `/contact` | Contact form (writes to `contact_messages`) |
| `/join` | Developer network signup — Google OAuth, GitHub OAuth, SMTP magic-link |
| `/dashboard` | Developer profile dashboard (post-auth) |
| `/admin` | Full CMS — see below |

---

## Admin CMS (`/admin`)

**Default credentials:** `mrfrankofc` / `1234`

Fully password-protected CMS panel. All changes write to Supabase in real time.

| Tab | What you can manage |
|---|---|
| **Overview** | Live stats for all tables |
| **Events & News** | Post updates, events, news, announcements, achievements |
| **Services** | Add / edit / reorder / toggle visibility |
| **Projects** | Portfolio items with image upload, tech tags, live/GitHub URLs |
| **Tech Stack** | Icons with categories |
| **Clients** | Client logos (upload or URL) |
| **Testimonials** | Name, role, quote, star rating, avatar |
| **Team** | Team member cards with socials |
| **Pricing** | Plan tiers with feature lists |
| **Blog Posts** | Write / edit / publish articles; View post link |
| **Sponsors** | Add sponsors + view / reply to inbound applications |
| **Developers** | Read-only view of the developer network with skills & socials |
| **Newsletter** | View all subscribers; one-click CSV export |
| **Messages** | Inbox for contact form submissions, mark-read, reply via email |
| **Site Settings** | Social links, footer tagline, contact info |

All image fields support **URL paste or direct upload** to Supabase Storage (`images` bucket). Any item can be shown/hidden with the visibility toggle without deleting it.

When Supabase is not configured the site renders high-quality fallback content automatically — no blank pages, no errors.

---

## Auth — Developer Network

Users can sign up / log in via `/join` using:

- **Google OAuth** — avatar auto-populated from Google account
- **GitHub OAuth** — avatar auto-populated from GitHub account
- **SMTP magic-link** — email + one-time link via denomailer (edge function)

After auth, a `developer_profiles` row is created automatically. Developers appear on the `/team` page and in the admin **Developers** tab.

---

## Quick Start

```bash
bun install
bun run dev
```

App runs on **http://localhost:5000**.

---

## Supabase Setup

### 1. Create a project

Go to [supabase.com](https://supabase.com), create a project, then grab:

- **Project URL** → `VITE_SUPABASE_URL`
- **Anon / public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

Add both as environment variables (Replit Secrets or `.env` file):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 2. Run the setup SQL

Open your Supabase project → **SQL Editor** → paste and run the entire contents of:

```
SYNAPEX_SUPABASE_SETUP.sql
```

This single file creates every table, adds all missing columns, enables RLS, and sets all policies. It is **safe to re-run** — every statement uses `IF NOT EXISTS` or `DO $$ BEGIN … END $$` blocks.

### 3. Create the images storage bucket

In your Supabase dashboard:

1. Go to **Storage** → **New bucket**
2. Name it exactly **`images`**
3. Set it to **Public**

The SQL file adds the storage policies automatically (step 12 in the file).

### 4. Enable OAuth providers (optional)

In **Authentication → Providers**:

| Provider | What to configure |
|---|---|
| **Google** | Enable → add Google Client ID & Secret from [console.cloud.google.com](https://console.cloud.google.com) |
| **GitHub** | Enable → add GitHub Client ID & Secret from [github.com/settings/developers](https://github.com/settings/developers) |

Add your domains to **Authentication → URL Configuration → Redirect URLs**:
```
https://synapex.co.zw/**
https://synapex.gleeze.com/**
http://localhost:5000/**
```

### 5. SMTP magic-link (optional)

Deploy the two edge functions in `supabase/functions/`:

- `send-magic-link` — sends the one-time link via denomailer
- `verify-magic-link` — validates the token and signs the user in

Set these secrets in **Project Settings → Edge Functions → Secrets**:

```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
SMTP_FROM=no-reply@synapex.co.zw
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `site_content` | Key-value store for social links, footer text, contact info |
| `services` | Agency service offerings |
| `projects` | Portfolio projects |
| `tech_stack` | Technology icons & categories |
| `clients` | Client logos & links |
| `testimonials` | Client testimonials |
| `team_members` | Core team profiles |
| `pricing_plans` | Pricing tier definitions |
| `blog_posts` | Articles (title, slug, content, published flag) |
| `contact_messages` | Inbound contact form submissions |
| `developer_profiles` | Auth-linked developer network profiles |
| `events` | Events, news, updates, announcements |
| `sponsors` | Current sponsors displayed on site |
| `sponsor_applications` | Inbound sponsorship applications |
| `newsletter_subscribers` | Email subscribers (upsert-safe) |
| `hidden_fallbacks` | Admin-hidden built-in fallback items |
| `magic_link_tokens` | SMTP auth one-time tokens |

---

## Project Structure

```
src/
├── routes/
│   ├── index.tsx            # Home
│   ├── team.tsx             # Core team + developer network
│   ├── sponsors.tsx         # Sponsor tiers + application form
│   ├── join.tsx             # Auth (Google / GitHub / magic-link)
│   ├── dashboard.tsx        # Developer profile dashboard
│   ├── blog.tsx             # Blog listing
│   ├── blog.$slug.tsx       # Individual post
│   ├── admin.tsx            # Full CMS panel
│   └── ...
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── Events.tsx       # Events & news feed
│   │   ├── Services.tsx
│   │   ├── Clients.tsx
│   │   ├── Technologies.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Process.tsx
│   │   ├── Projects.tsx
│   │   ├── Blog.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Sponsors.tsx     # Live DB sponsors + tier cards
│   │   ├── Newsletter.tsx   # Saves to newsletter_subscribers
│   │   └── CTA.tsx
│   ├── ImageInput.tsx       # URL paste + Supabase Storage upload
│   ├── FadeIn.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── SiteLayout.tsx
├── lib/
│   ├── content.ts           # Fallback data (realistic Zimbabwe/global clients)
│   ├── useContent.ts        # Supabase hooks with fallback merge
│   └── admin.ts             # Admin password auth
├── integrations/supabase/   # Supabase client + types
└── styles.css               # Tailwind + glass/star/grid utilities
supabase/
├── functions/
│   ├── send-magic-link/     # SMTP magic-link sender (denomailer)
│   └── verify-magic-link/   # Token verifier + Supabase sign-in
└── migrations/              # Individual migration history
SYNAPEX_SUPABASE_SETUP.sql   # ← Single file to run for a fresh DB
```

---

## Design System

- Pure black `#000000` background with animated star field + grid overlay
- Glassmorphism cards (`glass`, `glass-strong`, `glass-nav` CSS utilities)
- Animated gradient text (`text-fade`) on headings
- Scroll-triggered reveal animations (FadeIn component — left/right/up)
- Dual-row marquee for tech icons (opposing directions)
- Animated stats counter (counts up on viewport enter)
- Responsive navbar with "More" dropdown for secondary links
- Mobile-first — fully responsive at all breakpoints

---

## Deployment

This is a **pure static SPA** — no server required. Build output is `dist/`.

> **SPA routing:** your static host must rewrite all paths to `/index.html` (200 response) so TanStack Router handles navigation. See platform-specific config below.

### Render (recommended)

| Setting | Value |
|---|---|
| Build command | `npm install -g bun && bun install && bun run build` |
| Publish directory | `dist` |
| Redirect/rewrite | `/* → /index.html` (Rewrite 200) |

### Vercel

Add a `vercel.json`:
```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

### Cloudflare Pages

Add `public/_redirects`:
```
/* /index.html 200
```

### Environment variables (all platforms)

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | No | Supabase anon key |

Without Supabase vars the site works with built-in fallback content.

---

## Brand

- **Font:** System UI stack (Inter-style)
- **Palette:** Pure black with white at varying opacities
- **Logo:** `/public/synapex-logo.png`
- **Tagline:** *African innovation, global standards.*

---

## License

Proprietary. All rights reserved — Synapex Developers © 2026.

*Built in the brooks of Chitungwiza → shipped to the world.*
