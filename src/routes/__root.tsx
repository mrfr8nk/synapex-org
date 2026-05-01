import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

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
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            ← Back to home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full glass hairline-hover px-6 py-3 text-sm font-medium hover:bg-white/10 transition-all"
          >
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
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Synapex Developers — We Build Powerful Digital Experiences" },
      { name: "description", content: "Synapex Developers builds premium websites, mobile apps, AI systems and software for ambitious teams worldwide." },
      { name: "author", content: "Synapex Developers" },
      { property: "og:title", content: "Synapex Developers — We Build Powerful Digital Experiences" },
      { property: "og:description", content: "Synapex Developers builds premium websites, mobile apps, AI systems and software for ambitious teams worldwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Synapex Developers — We Build Powerful Digital Experiences" },
      { name: "twitter:description", content: "Synapex Developers builds premium websites, mobile apps, AI systems and software for ambitious teams worldwide." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e1b14311-a6df-47a5-b0d9-f28b0e06b9ec" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e1b14311-a6df-47a5-b0d9-f28b0e06b9ec" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
