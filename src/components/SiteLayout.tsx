// Mazvokuda !!!!

import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
