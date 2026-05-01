import { SectionHeader } from "./Services";
import { useClients } from "@/lib/useContent";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";

const clientIconSlugs: Record<string, string> = {
  "Google": "google",
  "Microsoft": "microsoft",
  "Shopify": "shopify",
  "Stripe": "stripe",
  "Notion": "notion",
  "Vercel": "vercel",
  "GitHub": "github",
  "Supabase": "supabase",
  "Airbnb": "airbnb",
  "Netflix": "netflix",
  "Slack": "slack",
  "Figma": "figma",
  "Twitter": "x",
  "Meta": "meta",
  "Apple": "apple",
  "Amazon": "amazon",
  "Spotify": "spotify",
  "Discord": "discord",
  "Linear": "linear",
  "Twilio": "twilio",
};

const clientColors: Record<string, string> = {
  "Google": "from-blue-500/20 to-green-500/20",
  "Microsoft": "from-blue-600/20 to-blue-400/20",
  "Shopify": "from-green-500/20 to-emerald-400/20",
  "Stripe": "from-violet-500/20 to-blue-500/20",
  "Notion": "from-white/10 to-white/5",
  "Vercel": "from-white/15 to-white/5",
  "GitHub": "from-gray-500/20 to-black/30",
  "Supabase": "from-emerald-500/20 to-green-400/20",
};

function ClientLogo({ client }: { client: any }) {
  const slug = clientIconSlugs[client.name];
  const gradient = clientColors[client.name] || "from-white/10 to-white/5";

  if (client.logo_url) {
    return (
      <img
        src={client.logo_url}
        alt={client.name}
        className="max-h-10 max-w-[140px] object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
      />
    );
  }

  if (slug) {
    return (
      <div className="flex flex-col items-center gap-3">
        <img
          src={`https://cdn.simpleicons.org/${slug}/ffffff`}
          alt={client.name}
          className="h-8 w-8 object-contain opacity-40 group-hover:opacity-90 transition-all duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="text-xs font-medium text-white/30 group-hover:text-white/70 transition-colors duration-300 tracking-wider">
          {client.name}
        </span>
      </div>
    );
  }

  return (
    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-white/10`}>
      <span className="text-xl font-bold text-white/60 group-hover:text-white transition-colors">
        {client.name.charAt(0)}
      </span>
    </div>
  );
}

export function Clients() {
  const clients = useClients();

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn direction="up">
          <SectionHeader
            eyebrow="Trusted by"
            title="Teams we've shipped for."
            subtitle="From scrappy startups to category-defining companies."
          />
        </FadeIn>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-3xl glass">
          {clients.map((c: any, i: number) => (
            <motion.a
              key={c.id}
              href={c.website_url || "#"}
              target={c.website_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-black/40 backdrop-blur-xl p-10 flex flex-col items-center justify-center min-h-[140px] gap-3 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer"
            >
              <ClientLogo client={c} />
            </motion.a>
          ))}
        </div>

        <FadeIn direction="up" delay={0.2} className="mt-8 text-center">
          <p className="text-sm text-white/30">
            and <span className="text-white/60 font-medium">80+ more</span> businesses across Africa, Europe & the Americas
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
