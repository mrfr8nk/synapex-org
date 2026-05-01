import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Sponsors } from "@/components/sections/Sponsors";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <SiteLayout>
      <div className="pt-20">
        <Sponsors />
        <CTA />
      </div>
    </SiteLayout>
  );
}
