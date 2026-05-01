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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Synapex Developers — Engineering the future of software" },
      { name: "description", content: "Premium web, mobile, AI and SaaS development for ambitious teams worldwide." },
      { property: "og:title", content: "Synapex Developers" },
      { property: "og:description", content: "African innovation, global standards." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Services />
      <Clients />
      <WhyUs />
      <Technologies />
      <Process />
      <Projects />
      <Blog />
      <Testimonials />
      <Newsletter />
      <CTA />
    </SiteLayout>
  );
}
