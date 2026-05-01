import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { Projects } from "@/components/sections/Projects";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Synapex Developers — We Build Powerful Digital Experiences" },
      { name: "description", content: "Synapex Developers builds websites, mobile apps, AI systems, SaaS platforms, and automation for ambitious teams worldwide." },
      { property: "og:title", content: "Synapex Developers" },
      { property: "og:description", content: "African innovation, global standards. Web, mobile, AI and software solutions." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <Services />
      <Technologies />
      <Projects />
      <WhyUs />
      <Testimonials />
      <CTA />
    </SiteLayout>
  );
}
