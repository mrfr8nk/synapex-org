import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

const SITE_URL = "https://synapex.co.zw";
const SITE_NAME = "Synapex Technologies";
const DEFAULT_DESC = "Synapex Technologies — premium websites, mobile apps, AI systems and software built by Synapex Developers. Founded by Darrell Mucheri.";
const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e1b14311-a6df-47a5-b0d9-f28b0e06b9ec";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: ["Synapex", "Synapex Developers", "Synapex Dev"],
  url: SITE_URL,
  logo: `${SITE_URL}/synapex-logo.png`,
  image: OG_IMAGE,
  description: DEFAULT_DESC,
  founder: {
    "@type": "Person",
    name: "Darrell Mucheri",
    jobTitle: "Founder & CEO",
    url: SITE_URL,
  },
  sameAs: [
    "https://github.com/synapex",
    "https://twitter.com/synapexdev",
    "https://www.linkedin.com/company/synapex",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@synapex.co.zw",
    contactType: "customer support",
    areaServed: "Worldwide",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 overflow-hidden">
      <div className="absolute inset-0 stars" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 spotlight" />
      <div className="relative text-center max-w-lg">
        <div className="text-[160px] font-black tracking-tighter leading-none text-fade select-none">404</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Lost in space</h2>
        <p className="mt-3 text-sm text-white/50 leading-relaxed">
          This page doesn't exist or has been moved to another orbit.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all hover:scale-[1.02]">
            ← Back to home
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full glass hairline-hover px-6 py-3 text-sm font-medium hover:bg-white/10 transition-all">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Synapex Technologies — Websites, Apps, AI & Software by Synapex Developers" },
      { name: "description", content: DEFAULT_DESC },
      { name: "author", content: "Synapex Developers" },
      {
        name: "keywords",
        content: "Synapex, Synapex Technologies, Synapex Developers, Synapex Dev, Darrell Mucheri, Synapex Zimbabwe, software agency Zimbabwe, web development Zimbabwe, mobile app development, AI development, custom software, SaaS development, React developers, Next.js agency, Africa software agency",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "theme-color", content: "#000000" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: "Synapex Technologies — Websites, Apps, AI & Software" },
      { property: "og:description", content: DEFAULT_DESC },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@synapexdev" },
      { name: "twitter:creator", content: "@darrellmucheri" },
      { name: "twitter:title", content: "Synapex Technologies — Websites, Apps, AI & Software" },
      { name: "twitter:description", content: DEFAULT_DESC },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/synapex-logo.png" },
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Scripts />
    </>
  );
}
