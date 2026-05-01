import { SectionHeader } from "./Services";

const techs = [
  "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
  "Python", "TensorFlow", "OpenAI", "PostgreSQL", "MongoDB",
  "Firebase", "Docker", "Linux", "GitHub", "Cloudflare",
];

export function Technologies() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="px-6">
        <SectionHeader
          tag="Our stack"
          title={<>Powered by the <span className="text-gradient">best in tech</span></>}
          subtitle="We use battle-tested tools that ship fast and scale globally."
        />
      </div>

      <div className="mt-16 relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap">
          {[...techs, ...techs].map((t, i) => (
            <div
              key={i}
              className="mx-3 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:shadow-glow transition-shadow"
            >
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-cyan to-purple" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
