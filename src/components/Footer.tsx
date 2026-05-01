import { Link } from "@tanstack/react-router";
import { Sparkles, Github, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary via-accent to-purple flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Synapex Developers</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Young African developers building world-class software, AI systems and digital
              experiences for businesses, startups, and creators worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              {[Github, Twitter, Linkedin, Instagram, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-lg glass flex items-center justify-center hover:shadow-glow transition-all hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-colors">Services</Link></li>
              <li><Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@synapex.dev</li>
              <li>Harare, Zimbabwe</li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Start a project →</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Synapex Developers. All rights reserved.</p>
          <p>Crafted with code, caffeine & curiosity.</p>
        </div>
      </div>
    </footer>
  );
}
