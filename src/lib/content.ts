// Hardcoded fallback content used when admin hasn't set anything.
import {
  Code2, Smartphone, Brain, Palette, Cloud, Bot,
  GraduationCap, Plug, Layers, Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Code2, Smartphone, Brain, Palette, Cloud, Bot,
  GraduationCap, Plug, Layers, Zap,
};

export const fallbackServices = [
  { id: "f1", title: "Web Development", description: "Blazing-fast, SEO-ready sites built with modern stacks like React, Next.js and Vite.", icon: "Code2" },
  { id: "f2", title: "Mobile Apps", description: "Native-feel iOS & Android apps with React Native that users love to open.", icon: "Smartphone" },
  { id: "f3", title: "AI Integration", description: "GPT, Claude & custom models embedded seamlessly into your product workflow.", icon: "Brain" },
  { id: "f4", title: "UI / UX Design", description: "Premium interfaces and design systems that convert visitors into customers.", icon: "Palette" },
  { id: "f5", title: "SaaS Platforms", description: "Multi-tenant platforms with auth, billing, analytics and admin dashboards.", icon: "Layers" },
  { id: "f6", title: "WhatsApp Bots", description: "Automated customer flows on the world's biggest messenger, available 24/7.", icon: "Bot" },
  { id: "f7", title: "Cloud Solutions", description: "Cloud deployments on AWS, GCP and Cloudflare engineered for scale.", icon: "Cloud" },
  { id: "f8", title: "Automation", description: "Workflows and integrations that save dozens of hours every week.", icon: "Zap" },
  { id: "f9", title: "School Systems", description: "Modern management platforms built for schools and institutions.", icon: "GraduationCap" },
  { id: "f10", title: "API Development", description: "Robust REST & GraphQL APIs with full documentation and SDKs.", icon: "Plug" },
];

export const fallbackProjects = [
  { id: "p1", title: "NeuroDash", category: "SaaS", description: "AI-powered analytics dashboard with realtime insights and custom reporting for enterprise teams.", tech: ["Next.js", "OpenAI", "PostgreSQL"], live_url: "#", github_url: null, image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
  { id: "p2", title: "EduFlow", category: "School System", description: "School management platform deployed across 50+ institutions in 3 countries, used by 10,000+ students.", tech: ["React", "Node.js", "MongoDB"], live_url: "#", github_url: null, image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" },
  { id: "p3", title: "ChatPilot", category: "AI Bot", description: "WhatsApp + Web AI assistant handling thousands of concurrent conversations with sub-100ms response time.", tech: ["Python", "Twilio", "GPT-4"], live_url: "#", github_url: null, image_url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80" },
  { id: "p4", title: "Vaultify", category: "Mobile", description: "Personal finance tracker with bank-grade encryption, biometric auth, and a beautiful cross-platform UI.", tech: ["React Native", "Firebase"], live_url: "#", github_url: null, image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80" },
  { id: "p5", title: "Pulse Commerce", category: "Web", description: "Headless e-commerce platform achieving 99 Lighthouse score with sub-second loads and 99.9% uptime.", tech: ["Next.js", "Stripe"], live_url: "#", github_url: null, image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" },
  { id: "p6", title: "Lumen API", category: "API", description: "Image generation API serving over 1M+ requests per month with 99.9% uptime and a global CDN.", tech: ["FastAPI", "Docker"], live_url: "#", github_url: null, image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
];

export const fallbackTechStack = [
  { id: "t0", name: "React", category: "Frontend" },
  { id: "t1", name: "Next.js", category: "Frontend" },
  { id: "t2", name: "TypeScript", category: "Language" },
  { id: "t3", name: "Node.js", category: "Backend" },
  { id: "t4", name: "Tailwind CSS", category: "Styling" },
  { id: "t5", name: "Python", category: "Backend" },
  { id: "t6", name: "TensorFlow", category: "AI/ML" },
  { id: "t7", name: "OpenAI", category: "AI/ML" },
  { id: "t8", name: "PostgreSQL", category: "Database" },
  { id: "t9", name: "MongoDB", category: "Database" },
  { id: "t10", name: "Firebase", category: "BaaS" },
  { id: "t11", name: "Docker", category: "DevOps" },
  { id: "t12", name: "Linux", category: "DevOps" },
  { id: "t13", name: "GitHub", category: "DevOps" },
  { id: "t14", name: "Cloudflare", category: "Infra" },
  { id: "t15", name: "Supabase", category: "BaaS" },
  { id: "t16", name: "Stripe", category: "Payments" },
  { id: "t17", name: "GraphQL", category: "API" },
  { id: "t18", name: "Redis", category: "Database" },
  { id: "t19", name: "Vercel", category: "Infra" },
];

export const fallbackClients = [
  { id: "c1", name: "Google", logo_url: null, website_url: "https://google.com" },
  { id: "c2", name: "Microsoft", logo_url: null, website_url: "https://microsoft.com" },
  { id: "c3", name: "Shopify", logo_url: null, website_url: "https://shopify.com" },
  { id: "c4", name: "Stripe", logo_url: null, website_url: "https://stripe.com" },
  { id: "c5", name: "Notion", logo_url: null, website_url: "https://notion.so" },
  { id: "c6", name: "Vercel", logo_url: null, website_url: "https://vercel.com" },
  { id: "c7", name: "GitHub", logo_url: null, website_url: "https://github.com" },
  { id: "c8", name: "Supabase", logo_url: null, website_url: "https://supabase.com" },
];

export const fallbackTestimonials = [
  { id: "ts1", name: "Tariro M.", role: "Founder, EduFlow", quote: "Synapex shipped our school platform in weeks, not months. The quality is unreal — clean code, beautiful UI, and it just works.", rating: 5, avatar_url: null },
  { id: "ts2", name: "Daniel K.", role: "CTO, Pulse Commerce", quote: "Cleanest codebase we've ever inherited. The team is sharp, detail-obsessed and genuinely cares about your product's success.", rating: 5, avatar_url: null },
  { id: "ts3", name: "Aisha R.", role: "PM, NeuroDash", quote: "They turned a vague AI idea into a product our users love. The velocity was incredible and the communication was always top-notch.", rating: 5, avatar_url: null },
  { id: "ts4", name: "Brian T.", role: "Owner, Vaultify", quote: "Beautiful design, smooth animations, and a mobile app that feels truly native. Users constantly compliment the UX.", rating: 5, avatar_url: null },
];

export const fallbackTeam = [
  {
    id: "tm1", name: "Darrell M.", role: "Founder & Lead Engineer",
    bio: "Full-stack engineer obsessed with clean architecture, performance and building products that scale. Founded Synapex at 19.",
    image_url: null, twitter_url: "https://twitter.com", linkedin_url: "https://linkedin.com", github_url: "https://github.com",
    specialty: "React · Node.js · Architecture",
  },
  {
    id: "tm2", name: "Crejinai M.", role: "Product Designer",
    bio: "Designs interfaces that feel inevitable. Passionate about motion design, systems thinking and making complex things look effortless.",
    image_url: null, twitter_url: null, linkedin_url: "https://linkedin.com", github_url: null,
    specialty: "Figma · Motion · Systems",
  },
  {
    id: "tm3", name: "Kuda L.", role: "Mobile Engineer",
    bio: "Native iOS & Android specialist who ships apps that feel premium. Obsessed with performance and smooth 120fps animations.",
    image_url: null, twitter_url: null, linkedin_url: "https://linkedin.com", github_url: "https://github.com",
    specialty: "React Native · Swift · Kotlin",
  },
  {
    id: "tm4", name: "Nyasha P.", role: "AI Engineer",
    bio: "Building intelligent systems with LLMs, RAG pipelines and custom ML models. Making AI actually useful in production.",
    image_url: null, twitter_url: "https://twitter.com", linkedin_url: "https://linkedin.com", github_url: "https://github.com",
    specialty: "Python · LLMs · ML · RAG",
  },
  {
    id: "tm5", name: "Tafadzwa R.", role: "Backend Engineer",
    bio: "Distributed systems and API design enthusiast. Builds the infrastructure that powers everything you see on the front.",
    image_url: null, twitter_url: null, linkedin_url: "https://linkedin.com", github_url: "https://github.com",
    specialty: "Node.js · PostgreSQL · DevOps",
  },
  {
    id: "tm6", name: "Rudo C.", role: "QA & DevOps",
    bio: "Keeps everything reliable and fast. Writes the tests everyone forgets, sets up CI/CD and makes sure deployments never break.",
    image_url: null, twitter_url: null, linkedin_url: "https://linkedin.com", github_url: "https://github.com",
    specialty: "Docker · CI/CD · Testing",
  },
];

export const fallbackPricing = [
  {
    id: "pr1", name: "Starter", price: "$100", description: "Perfect for founders validating their first MVP.",
    features: ["Landing page or 3-page app", "Mobile responsive", "Basic SEO setup", "1 round of revisions", "1-week delivery", "Source code included"],
    is_popular: false,
  },
  {
    id: "pr2", name: "Professional", price: "$250", description: "For growing businesses ready to scale their digital presence.",
    features: ["Multi-page web or mobile app", "Custom design system", "Auth + Database integration", "AI integration ready", "3 rounds of revisions", "60 days post-launch support", "Priority Slack channel"],
    is_popular: true,
  },
  {
    id: "pr3", name: "Enterprise", price: "Let's talk", description: "For ambitious platforms, SaaS products and funded startups.",
    features: ["Full SaaS / platform build", "Custom AI model integration", "Dedicated team of engineers", "DevOps & cloud infrastructure", "SLA & priority support", "Quarterly strategy reviews"],
    is_popular: false,
  },
];

export const fallbackContent: Record<string, any> = {
  hero_eyebrow: "Innovation, global standards",
  hero_title: "We engineer the future of software",
  hero_subtitle: "Synapex Developers builds premium websites, mobile apps, AI systems and platforms for ambitious teams worldwide.",
  hero_cta_primary: "Start a project",
  hero_cta_secondary: "View our work",
  stats: [
    { value: "120+", label: "Projects shipped" },
    { value: "80+", label: "Happy clients" },
    { value: "25+", label: "Technologies" },
    { value: "12", label: "Engineers" },
  ],
  about_title: "Young engineers. World-class craft.",
  about_body: "Synapex Developers is a software studio born in Zimbabwe with a global mindset. We build premium digital products for ambitious teams who refuse to settle for mediocre software.",
  contact_email: "contact@synapex.co.zw",
  contact_whatsapp: "+263 719 647 303",
  contact_location: "Harare, Zimbabwe — serving worldwide",
  social_github: "https://github.com/synapex-dev",
  social_twitter: "https://twitter.com/synapex_dev",
  social_linkedin: "https://linkedin.com/company/synapex",
  social_instagram: "https://instagram.com/synapex_dev",
  social_facebook: "",
  social_youtube: "",
  footer_tagline: "Engineering premium software, AI systems and digital experiences for ambitious teams worldwide.",
};

export const fallbackBlogPosts = [
  {
    id: "b1", title: "Why We Always Start With Architecture", slug: "why-start-with-architecture",
    summary: "Most failed projects don't fail from bad code — they fail from bad decisions made before a single line was written.",
    content: `Most failed projects don't fail from bad code — they fail from bad decisions made before a single line was written.\n\nAt Synapex, our first sprint with any client is always discovery and architecture. We map out the data models, the API boundaries, the deployment strategy, and the authentication flow before touching the IDE.\n\nThis takes longer upfront. Clients sometimes push back. But it saves weeks of painful refactoring down the road.\n\n## What Good Architecture Looks Like\n\nGood architecture is invisible when it works and painful when it doesn't. We define it by three principles:\n\n1. **Changeability** — Can we swap the database without rewriting the entire app?\n2. **Scalability** — Will this hold up when the user count 10x's?\n3. **Clarity** — Can a new engineer understand the codebase in under a day?\n\nWhen all three are true, we ship faster and break less.`,
    image_url: null, category: "Engineering", published: true, author: "Darrell M.",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "b2", title: "Building AI Products That Actually Ship", slug: "building-ai-products-that-ship",
    summary: "Everyone wants AI in their product. Most AI features end up in the backlog graveyard. Here's how we make them survive.",
    content: `Everyone wants AI in their product. Most AI features end up in the backlog graveyard. Here's how we make them survive.\n\nThe core mistake we see: teams treat AI as a feature bolt-on rather than designing around it from day one. They build the full product, then try to inject GPT calls at the last minute.\n\n## Our Approach\n\nWe start every AI project with a *prompt audit* — a document that defines:\n- What the model should and shouldn't do\n- How we handle hallucinations\n- What the user sees when the AI fails\n- How we evaluate quality over time\n\nThis sounds boring. It's the difference between an AI feature users trust and one they ignore after day one.`,
    image_url: null, category: "AI", published: true, author: "Nyasha P.",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "b3", title: "The Case for Boring Technology", slug: "case-for-boring-technology",
    summary: "Chasing the latest framework feels exciting. But boring, proven tech ships better products faster — and your clients don't care.",
    content: `Chasing the latest framework feels exciting. But boring, proven tech ships better products faster — and your clients don't care.\n\nWe get questions all the time: "Should we use Bun or Node? SolidJS or React? PlanetScale or Supabase?"\n\nOur answer: it almost never matters as much as execution does.\n\nBoring technology — React, PostgreSQL, Docker, Node.js — has solved problems. It has StackOverflow answers. It has battle-tested patterns. It has engineers who know how to use it.\n\n## When to Be Boring\n\nChoose boring tech when:\n- The team doesn't have time to learn a new paradigm\n- The problem is solved, just not for you specifically\n- Hiring is already hard enough`,
    image_url: null, category: "Engineering", published: true, author: "Darrell M.",
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
];

export const fallbackFaq = [
  { id: "q1", question: "How long does a typical project take?", answer: "Timelines vary by scope. A landing page takes 3–7 days. A full SaaS platform takes 4–12 weeks. We always give a detailed timeline in our proposal before any commitment." },
  { id: "q2", question: "Do you work with clients outside Zimbabwe?", answer: "Absolutely — the majority of our clients are international. We work across Africa, Europe, North America and Asia. Time zones are manageable; great software isn't geography-dependent." },
  { id: "q3", question: "What's your pricing model?", answer: "We offer fixed-price project packages (see Pricing page) and retainer/hourly for ongoing work. We're transparent about costs upfront — no surprise invoices." },
  { id: "q4", question: "Who owns the code and IP?", answer: "You do, 100%. On project completion, all source code, assets and documentation are yours. We never hold IP hostage." },
  { id: "q5", question: "Do you offer post-launch support?", answer: "Yes. Professional plan includes 60 days of support. Enterprise plans include a full SLA. We also offer monthly retainers for teams who need ongoing engineering capacity." },
  { id: "q6", question: "What technologies do you use?", answer: "Primarily React/Next.js, TypeScript, Node.js, Python, React Native, and PostgreSQL/Supabase. We choose tools based on the project's needs, not what's trending on Twitter." },
  { id: "q7", question: "Can I see examples of past work?", answer: "Visit our Work page for project showcases. We can also share detailed case studies and references on request during a discovery call." },
  { id: "q8", question: "How do we get started?", answer: "Hit 'Get started' or visit the Contact page. We'll schedule a free 30-minute discovery call to understand your project, then send a detailed proposal within 48 hours." },
];

export const fallbackCareers = [
  {
    id: "j1", title: "Senior Full-Stack Engineer", type: "Full-time", location: "Remote (Africa)",
    department: "Engineering", open: true, salary_range: "$2,500 – $4,500/mo",
    description: "Build premium web products with React, Node.js and PostgreSQL. Strong TypeScript skills required. You care deeply about architecture and code quality.",
    requirements: ["4+ years full-stack experience", "TypeScript/React proficiency", "Database design skills", "API design experience"],
  },
  {
    id: "j2", title: "Mobile Engineer (React Native)", type: "Full-time", location: "Remote",
    department: "Engineering", open: true, salary_range: "$2,000 – $3,500/mo",
    description: "Ship cross-platform mobile apps that feel truly native. You understand performance optimization and have shipped apps to both the App Store and Play Store.",
    requirements: ["3+ years React Native", "Expo experience", "iOS/Android fundamentals", "Published apps portfolio"],
  },
  {
    id: "j3", title: "AI / ML Engineer", type: "Contract", location: "Remote",
    department: "Engineering", open: true, salary_range: "$3,000 – $6,000/mo",
    description: "Integrate LLMs, build RAG pipelines and productionize ML models. You've moved beyond tutorials and shipped AI features real users depend on.",
    requirements: ["Python proficiency", "LLM API experience (OpenAI/Anthropic)", "RAG pipeline knowledge", "Production ML experience"],
  },
  {
    id: "j4", title: "UI/UX Designer", type: "Contract", location: "Remote",
    department: "Design", open: true, salary_range: "$1,500 – $3,000/mo",
    description: "Design beautiful, functional interfaces in Figma. You think in systems, not screens, and understand how your designs get implemented in code.",
    requirements: ["Figma mastery", "Design systems experience", "Motion/animation skills", "Developer handoff experience"],
  },
];
