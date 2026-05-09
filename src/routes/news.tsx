import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Events } from "@/components/sections/Events";
import { SectionHeader } from "@/components/sections/Services";
import { FadeIn } from "@/components/FadeIn";
import { Newsletter } from "@/components/sections/Newsletter";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "News & Updates — Synapex" },
      { name: "description", content: "Latest updates, events, and announcements from the Synapex team." },
      { property: "og:title", content: "News & Updates — Synapex" },
      { property: "og:description", content: "Latest updates, events, and announcements from the Synapex team." },
    ],
  }),
});

function NewsPage() {
  return (
    <SiteLayout>
      <section className="relative pt-32 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 stars opacity-40" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative max-w-7xl mx-auto">
          <FadeIn direction="up">
            <SectionHeader
              eyebrow="Newsroom"
              title="News & updates."
              subtitle="What we're shipping, hiring, announcing and celebrating."
            />
          </FadeIn>
        </div>
      </section>
      <Events />
      <Newsletter />
    </SiteLayout>
  );
}
