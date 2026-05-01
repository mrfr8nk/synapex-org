import { Outlet, Link, createRootRoute } from "@tanstack/react-router";

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
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
});
