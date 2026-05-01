import { SectionHeader } from "./Services";
import { useClients } from "@/lib/useContent";
import { motion } from "framer-motion";

export function Clients() {
  const clients = useClients();

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Trusted by"
          title="Teams we've shipped for."
          subtitle="From scrappy startups to established institutions."
        />

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px overflow-hidden rounded-3xl glass">
          {clients.map((c: any, i: number) => (
            <motion.a
              key={c.id}
              href={c.website_url || "#"}
              target={c.website_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group bg-black/40 backdrop-blur-xl p-8 flex items-center justify-center min-h-[120px] hover:bg-white/[0.04] transition-colors"
            >
              {c.logo_url ? (
                <img
                  src={c.logo_url}
                  alt={c.name}
                  className="max-h-10 max-w-[140px] object-contain opacity-50 group-hover:opacity-100 transition-opacity grayscale"
                />
              ) : (
                <span className="text-lg font-semibold tracking-tight text-white/40 group-hover:text-white transition-colors">
                  {c.name}
                </span>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
