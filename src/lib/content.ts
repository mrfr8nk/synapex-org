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
  { id: "f1", title: "Web Development", description: "Blazing-fast, SEO-ready sites built with modern stacks.", icon: "Code2" },
  { id: "f2", title: "Mobile Apps", description: "Native-feel iOS & Android apps with React Native.", icon: "Smartphone" },
  { id: "f3", title: "AI Integration", description: "GPT, Claude & custom models embedded into your product.", icon: "Brain" },
  { id: "f4", title: "UI / UX Design", description: "Premium interfaces and design systems that convert.", icon: "Palette" },
  { id: "f5", title: "SaaS Platforms", description: "Multi-tenant platforms with auth, billing & analytics.", icon: "Layers" },
  { id: "f6", title: "WhatsApp Bots", description: "Automated customer flows on the world's biggest messenger.", icon: "Bot" },
  { id: "f7", title: "Cloud Solutions", description: "Cloud deployments engineered for scale.", icon: "Cloud" },
  { id: "f8", title: "Automation", description: "Workflows and integrations that save hours weekly.", icon: "Zap" },
  { id: "f9", title: "School Systems", description: "Modern management platforms for schools.", icon: "GraduationCap" },
  { id: "f10", title: "API Development", description: "Robust REST & GraphQL APIs with documentation.", icon: "Plug" },
];

export const fallbackProjects = [
  { id: "p1", title: "NeuroDash", category: "SaaS", description: "AI-powered analytics dashboard with realtime insights.", tech: ["Next.js", "OpenAI", "Postgres"], live_url: null, github_url: null, image_url: null },
  { id: "p2", title: "EduFlow", category: "School System", description: "School management platform for 50+ institutions.", tech: ["React", "Node", "MongoDB"], live_url: null, github_url: null, image_url: null },
  { id: "p3", title: "ChatPilot", category: "AI Bot", description: "WhatsApp + Web AI assistant handling thousands of chats.", tech: ["Python", "Twilio", "GPT-4"], live_url: null, github_url: null, image_url: null },
  { id: "p4", title: "Vaultify", category: "Mobile", description: "Personal finance tracker with bank-grade security.", tech: ["React Native", "Firebase"], live_url: null, github_url: null, image_url: null },
  { id: "p5", title: "Pulse Commerce", category: "Web", description: "Headless e-commerce with 99 Lighthouse score.", tech: ["Next.js", "Stripe"], live_url: null, github_url: null, image_url: null },
  { id: "p6", title: "Lumen API", category: "API", description: "Image generation API serving 1M+ requests/month.", tech: ["FastAPI", "Docker"], live_url: null, github_url: null, image_url: null },
];

export const fallbackTechStack = [
  "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
  "Python", "TensorFlow", "OpenAI", "PostgreSQL", "MongoDB",
  "Firebase", "Docker", "Linux", "GitHub", "Cloudflare",
].map((name, i) => ({ id: `t${i}`, name, category: null }));

export const fallbackClients = [
  { id: "c1", name: "Acme Corp", logo_url: null, website_url: null },
  { id: "c2", name: "Lumora", logo_url: null, website_url: null },
  { id: "c3", name: "Northstar", logo_url: null, website_url: null },
  { id: "c4", name: "Voltic", logo_url: null, website_url: null },
  { id: "c5", name: "Helix Labs", logo_url: null, website_url: null },
  { id: "c6", name: "Orbit", logo_url: null, website_url: null },
  { id: "c7", name: "Quanta", logo_url: null, website_url: null },
  { id: "c8", name: "Kairos", logo_url: null, website_url: null },
];

export const fallbackTestimonials = [
  { id: "ts1", name: "Tariro M.", role: "Founder, EduFlow", quote: "Synapex shipped our school platform in weeks, not months. The quality is unreal.", rating: 5, avatar_url: null },
  { id: "ts2", name: "Daniel K.", role: "CTO, Pulse Commerce", quote: "Cleanest codebase we've ever inherited. The team is sharp and obsessed with details.", rating: 5, avatar_url: null },
  { id: "ts3", name: "Aisha R.", role: "PM, NeuroDash", quote: "They turned a vague AI idea into a product our users love.", rating: 5, avatar_url: null },
  { id: "ts4", name: "Brian T.", role: "Owner, Vaultify", quote: "Beautiful design, smooth animations, and a mobile app that feels truly native.", rating: 5, avatar_url: null },
];

export const fallbackTeam = [
  { id: "tm1", name: "Frank M.", role: "Founder & Lead Engineer", bio: "Full-stack engineer obsessed with clean architecture.", image_url: null, twitter_url: null, linkedin_url: null, github_url: null },
  { id: "tm2", name: "Tendai R.", role: "Product Designer", bio: "Designs interfaces that feel inevitable.", image_url: null, twitter_url: null, linkedin_url: null, github_url: null },
  { id: "tm3", name: "Kuda L.", role: "Mobile Engineer", bio: "Native iOS & Android specialist.", image_url: null, twitter_url: null, linkedin_url: null, github_url: null },
  { id: "tm4", name: "Nyasha P.", role: "AI Engineer", bio: "Building intelligent systems with LLMs.", image_url: null, twitter_url: null, linkedin_url: null, github_url: null },
];

export const fallbackPricing = [
  { id: "pr1", name: "Starter", price: "$499", description: "For founders launching their first MVP.",
    features: ["Landing page or 1-page app", "Mobile responsive", "Basic SEO", "1 round of revisions", "2-week delivery"],
    is_popular: false },
  { id: "pr2", name: "Professional", price: "$2,499", description: "For growing businesses ready to scale.",
    features: ["Multi-page web or mobile app", "Custom design system", "Auth + Database", "AI integration ready", "3 rounds of revisions", "60 days support"],
    is_popular: true },
  { id: "pr3", name: "Enterprise", price: "Let's talk", description: "For ambitious platforms & SaaS products.",
    features: ["Full SaaS / platform build", "Custom AI models", "Dedicated team", "DevOps & infra", "SLA & priority support"],
    is_popular: false },
];

export const fallbackContent: Record<string, any> = {
  hero_eyebrow: "African innovation, global standards",
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
  about_body: "Synapex Developers is a software studio born in Africa with a global mindset. We build premium digital products for ambitious teams who refuse to settle for mediocre software.",
  contact_email: "hello@synapex.dev",
  contact_whatsapp: "+263 78 000 0000",
  contact_location: "Harare, Zimbabwe — serving worldwide",
};
