import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { Clients } from "@/components/sections/Clients";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Stats } from "@/components/sections/Stats";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Blog } from "@/components/sections/Blog";
import { Newsletter } from "@/components/sections/Newsletter";
import { Sponsors } from "@/components/sections/Sponsors";
import { Events } from "@/components/sections/Events";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Synapex Technologies — Websites, Apps, AI & Software | Synapex Developers" },
      { name: "description", content: "Synapex Technologies builds premium websites, mobile apps and AI systems for ambitious teams. Founded by Darrell Mucheri." },
      { property: "og:title", content: "Synapex Technologies — Premium Software Agency" },
      { property: "og:description", content: "Websites, apps and AI systems by Synapex Developers. Founded by Darrell Mucheri." },
      { property: "og:url", content: "https://synapex.co.zw/" },
      { name: "twitter:title", content: "Synapex Technologies — Premium Software Agency" },
      { name: "twitter:description", content: "Websites, apps and AI systems by Synapex Developers." },
    ],
    links: [{ rel: "canonical", href: "https://synapex.co.zw/" }],
  }),
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Events />
      <Services />
      <Clients />
      <WhyUs />
      <Technologies />
      <Process />
      <Projects />
      <Blog />
      <Testimonials />
      <Sponsors />
      <Newsletter />
      <CTA />
    </SiteLayout>
  );
}
