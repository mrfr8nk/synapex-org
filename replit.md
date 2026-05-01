# Synapex Developers — Project Overview

## Tech Stack
- **Framework**: TanStack Start (React + SSR) with TanStack Router (file-based routing)
- **Build**: Vite 7
- **Package manager**: Bun
- **Styling**: Tailwind CSS v4 + custom CSS utilities (glass, glass-strong, glass-nav, stars, grid-bg, spotlight, text-fade, animate-marquee)
- **Animations**: Framer Motion v12, custom FadeIn component with scroll triggers
- **Backend**: Supabase (optional — falls back gracefully if not configured)
- **Icons**: Lucide React + Simple Icons CDN for brand/tech logos

## Pages / Routes
```
/           Home — Hero, Stats, Services, Clients, WhyUs, Technologies, Process, Projects, Blog, Testimonials, Newsletter, CTA
/about      About
/services   Services
/projects   Portfolio
/pricing    Pricing plans
/team       Team members
/blog       Blog listing (category filter)
/blog/$slug Individual blog post
/faq        FAQ accordion
/careers    Open positions
/contact    Contact form
/admin      CMS portal (mrfrankofc / darex)
```

## Project Structure
```
src/
  routes/
    __root.tsx          Root shell + 404 handler
    index.tsx           Home page (12 sections)
    blog.tsx            Blog listing with category filter
    blog.$slug.tsx      Individual blog post
    faq.tsx             FAQ accordion page
    careers.tsx         Careers / open positions
    admin.tsx           CMS admin (blog posts, services, etc)
    about/services/projects/team/pricing/contact.tsx
  components/
    Navbar.tsx          Glass navbar + "More" dropdown for secondary links
    Footer.tsx          Site footer with full link columns
    SiteLayout.tsx      Navbar + main + Footer wrapper
    FadeIn.tsx          Scroll-reveal animation wrapper (left/right/up/down)
    sections/
      Hero.tsx          Landing hero
      Stats.tsx         Animated counter metrics
      Services.tsx      Service cards (SectionHeader exported)
      Technologies.tsx  Dual-row marquee (forward + reverse)
      Clients.tsx       Client logo grid with Simple Icons
      WhyUs.tsx         Six differentiator cards (alt left/right scroll)
      Process.tsx       5-step process timeline (alt scroll)
      Projects.tsx      Portfolio grid with tech icons
      Blog.tsx          Blog preview (3 latest posts)
      Testimonials.tsx  Testimonial carousel
      Newsletter.tsx    Email signup with success state
      CTA.tsx           Final call-to-action
  lib/
    content.ts          All fallback data (services, projects, clients, blog, faq, careers, team)
    useContent.ts       Supabase hooks + useBlogPosts + useBlogPost + useSiteContent
    admin.ts            Admin auth (hardcoded credentials)
  integrations/
    supabase/client.ts  Supabase client (null-client proxy if not configured)
  routeTree.gen.ts      Manually maintained route tree (add new routes here)
public/
  synapex-logo.png      Synapex S logo
```

## Key Design Decisions
- **Dark theme**: Pure black bg, white glass morphism, star fields, grid overlay
- **Supabase optional**: Full site works with fallback content — no blank pages
- **Admin credentials**: username `mrfrankofc`, password `darex` (hardcoded, client-side only)
- **Tech icons**: Simple Icons CDN (`https://cdn.simpleicons.org/{slug}/ffffff`)
- **Scroll animations**: FadeIn component wraps sections, alternates left/right by index
- **Blog CMS**: Admin can create/edit/publish posts; blog.$slug.tsx renders with simple markdown parser
- **routeTree.gen.ts**: Must be manually updated when adding new routes (TanStack Start SSR)

## Supabase Tables (when connected)
services, projects, tech_stack, clients, testimonials, team_members, pricing_plans,
blog_posts (title, slug, summary, content, author, category, image_url, published, created_at),
contact_messages (name, email, phone, subject, message, created_at, read)

## Running
```bash
bun run dev    # Dev server on port 5000
bun run build  # Production build → dist/client
```

## Deployment
- Workflow: `bun run dev` → port 5000
- Deployment: Replit Autoscale, static config in `.replit`
