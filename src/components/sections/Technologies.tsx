import { SectionHeader } from "./Services";
import { useTechStack } from "@/lib/useContent";

export function Technologies() {
  const techs = useTechStack();
  const doubled = [...techs, ...techs];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="px-6">
        <SectionHeader
          eyebrow="Our stack"
          title="Built with the best."
          subtitle="Battle-tested tools that ship fast and scale globally."
        />
      </div>

      <div className="mt-20 relative">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((t: any, i: number) => (
            <div
              key={i}
              className="mx-2 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium hairline-hover transition-all hover:-translate-y-0.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              {t.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
