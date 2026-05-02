import { useClients } from "@/lib/useContent";
import { motion } from "framer-motion";

/* ── Custom SVG logo marks ─────────────────────────────────── */
const LogoMark = ({ name, logoUrl }: { name: string; logoUrl?: string | null }) => {
  if (logoUrl) {
    return <img src={logoUrl} alt={name} className="h-8 w-auto max-w-[80px] object-contain" />;
  }

  const marks: Record<string, JSX.Element> = {
    "Hack Club": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 20 L20 14 L26 20 L20 26 Z" fill="currentColor" />
      </svg>
    ),
    "Replit": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <rect x="8" y="8" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="22" y="8" width="10" height="10" rx="2" fill="currentColor" opacity="0.7" />
        <rect x="8" y="22" width="10" height="10" rx="2" fill="currentColor" opacity="0.7" />
        <rect x="22" y="22" width="10" height="10" rx="2" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    "Nust Academy": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <path d="M20 8 L32 14 L32 18 L20 24 L8 18 L8 14 Z" fill="currentColor" opacity="0.9" />
        <path d="M12 20 L12 30 L20 33 L28 30 L28 20" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="32" y1="18" x2="32" y2="30" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="31" r="2" fill="currentColor" />
      </svg>
    ),
    "EduFlow Zim": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <rect x="6" y="12" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="6" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M28 16 L36 20 L28 24 Z" fill="currentColor" />
        <line x1="10" y1="23" x2="22" y2="23" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    "AgriSmart Africa": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <path d="M20 34 L20 18" stroke="currentColor" strokeWidth="2" />
        <path d="M20 18 C20 18 10 14 10 8 C10 8 16 8 20 14 C24 8 30 8 30 8 C30 14 20 18 20 18 Z" fill="currentColor" opacity="0.85" />
        <path d="M20 26 C20 26 13 22 13 18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M20 22 C20 22 27 18 27 14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    "LearnAI Labs": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <circle cx="20" cy="18" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="13" cy="15" r="2" fill="currentColor" />
        <circle cx="27" cy="15" r="2" fill="currentColor" />
        <circle cx="20" cy="10" r="2" fill="currentColor" />
        <line x1="20" y1="28" x2="16" y2="34" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="28" x2="24" y2="34" stroke="currentColor" strokeWidth="2" />
        <line x1="14" y1="34" x2="26" y2="34" stroke="currentColor" strokeWidth="2" />
        <path d="M13 15 L20 10 L27 15" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    "Tutor Connect": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <circle cx="15" cy="14" r="5" fill="currentColor" opacity="0.9" />
        <path d="M6 30 C6 24 9 22 15 22 C21 22 24 24 24 30" fill="currentColor" opacity="0.5" />
        <path d="M26 10 L36 10 L36 22 L32 22 L32 26 L28 22 L26 22 Z" fill="currentColor" opacity="0.75" />
        <line x1="28" y1="14" x2="34" y2="14" stroke="white" strokeWidth="1.5" />
        <line x1="28" y1="18" x2="32" y2="18" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
    "Zim Digital Library": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <rect x="7" y="10" width="6" height="22" rx="1" fill="currentColor" opacity="0.9" />
        <rect x="15" y="8" width="8" height="24" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="25" y="11" width="8" height="21" rx="1" fill="currentColor" opacity="0.5" />
        <line x1="7" y1="32" x2="33" y2="32" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "BoutiqueOS": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <path d="M20 6 L26 12 L34 12 L34 34 L6 34 L6 12 L14 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 12 C14 8 26 8 26 12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M13 22 L20 18 L27 22 L20 26 Z" fill="currentColor" opacity="0.8" />
      </svg>
    ),
    "FarmLink Zim": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <line x1="20" y1="34" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
        <path d="M20 10 C20 10 16 14 16 18 L20 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M20 14 C20 14 24 18 24 22 L20 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M20 18 C20 18 16 22 16 26 L20 26" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="10" r="2.5" fill="currentColor" />
      </svg>
    ),
    "SchoolBridge": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <path d="M4 28 Q12 14 20 20 Q28 26 36 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="28" x2="4" y2="34" stroke="currentColor" strokeWidth="2" />
        <line x1="36" y1="12" x2="36" y2="34" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="2" />
        <line x1="14" y1="22" x2="14" y2="34" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="26" y1="18" x2="26" y2="34" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    "AgentStack": (
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <rect x="10" y="28" width="20" height="5" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="10" y="21" width="20" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="10" y="14" width="20" height="5" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="10" y="7" width="20" height="5" rx="1.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  };

  return marks[name] ?? (
    <svg viewBox="0 0 40 40" className="h-8 w-8">
      <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="700">
        {name.charAt(0)}
      </text>
    </svg>
  );
};

/* ── Marquee track ─────────────────────────────────────────── */
function MarqueeTrack({ clients, reverse = false }: { clients: any[]; reverse?: boolean }) {
  const doubled = [...clients, ...clients];
  return (
    <div className={`flex gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} whitespace-nowrap`}>
      {doubled.map((c: any, i: number) => (
        <motion.a
          key={`${c.id}-${i}`}
          href={c.website_url || undefined}
          target={c.website_url ? "_blank" : undefined}
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="group inline-flex flex-col items-center justify-center gap-1.5 w-[72px] h-[72px] rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-colors duration-300 shrink-0 text-white/35 hover:text-white/90 cursor-pointer"
          title={c.name}
        >
          <LogoMark name={c.name} logoUrl={c.logo_url} />
        </motion.a>
      ))}
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────── */
export function Clients() {
  const clients = useClients();

  const half = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, half);
  const row2 = clients.slice(half);

  return (
    <section className="relative py-16 px-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-white/6" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/30 whitespace-nowrap">
            Teams we've shipped for
          </span>
          <span className="h-px flex-1 bg-white/6" />
        </div>
      </div>

      {/* Fade masks */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

        <div className="space-y-3 overflow-hidden">
          <MarqueeTrack clients={row1.length >= 2 ? row1 : clients} />
          {row2.length >= 2 && <MarqueeTrack clients={row2} reverse />}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 text-center">
        <p className="text-xs text-white/20">
          and <span className="text-white/40 font-medium">80+ more</span> across Africa, Europe &amp; the Americas
        </p>
      </div>
    </section>
  );
}
