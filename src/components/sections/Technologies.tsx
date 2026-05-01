import { motion } from "framer-motion";
import { SectionHeader } from "./Services";
import { useTechStack } from "@/lib/useContent";

const techIconSlugs: Record<string, string> = {
  "React": "react",
  "Next.js": "nextdotjs",
  "TypeScript": "typescript",
  "Node.js": "nodedotjs",
  "Tailwind CSS": "tailwindcss",
  "Python": "python",
  "TensorFlow": "tensorflow",
  "OpenAI": "openai",
  "PostgreSQL": "postgresql",
  "MongoDB": "mongodb",
  "Firebase": "firebase",
  "Docker": "docker",
  "Linux": "linux",
  "GitHub": "github",
  "Cloudflare": "cloudflare",
  "Supabase": "supabase",
  "Stripe": "stripe",
  "GraphQL": "graphql",
  "Redis": "redis",
  "AWS": "amazonaws",
  "Vercel": "vercel",
  "Flutter": "flutter",
  "Swift": "swift",
  "Kotlin": "kotlin",
  "Rust": "rust",
  "Go": "go",
  "Vue": "vuedotjs",
  "Angular": "angular",
  "FastAPI": "fastapi",
  "Django": "django",
  "Express": "express",
  "Prisma": "prisma",
};

function TechIcon({ name }: { name: string }) {
  const slug = techIconSlugs[name] || name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/ffffff`}
      alt={name}
      className="h-4 w-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

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
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group mx-2 inline-flex items-center gap-2.5 rounded-full glass px-5 py-2.5 text-sm font-medium hairline-hover cursor-default"
            >
              <TechIcon name={t.name} />
              {t.name}
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex animate-marquee-reverse whitespace-nowrap">
          {[...doubled].reverse().map((t: any, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group mx-2 inline-flex items-center gap-2.5 rounded-full glass px-5 py-2.5 text-sm font-medium hairline-hover cursor-default opacity-60"
            >
              <TechIcon name={t.name} />
              {t.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
