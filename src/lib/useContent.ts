import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  fallbackServices, fallbackProjects, fallbackTechStack,
  fallbackClients, fallbackTestimonials, fallbackTeam,
  fallbackPricing, fallbackContent, fallbackBlogPosts,
} from "./content";

// Merge real DB rows with fallback rows.
// - Real rows always show (if visible)
// - Fallback rows show unless their id is in hidden_fallbacks
function useMergedTable<T extends { id: string }>(
  table: string,
  fallback: T[],
  section: string,
  orderBy = "sort_order",
) {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [rowsRes, hiddenRes] = await Promise.all([
          supabase.from(table as any).select("*").order(orderBy, { ascending: true }),
          supabase.from("hidden_fallbacks" as any).select("fallback_id").eq("section", section),
        ]);
        if (!active) return;
        const realRows = (rowsRes.data || []).filter((r: any) => r.visible !== false);
        const hiddenIds = new Set((hiddenRes.data || []).map((h: any) => h.fallback_id));
        const visibleFallback = fallback.filter((f) => !hiddenIds.has(f.id));
        // Real first, fallback after — admin can hide fallback individually
        setData([...realRows, ...visibleFallback] as T[]);
      } catch {
        // keep fallback
      }
    })();
    return () => { active = false; };
  }, [table, orderBy, section]);
  return data;
}

export const useServices = () => useMergedTable("services", fallbackServices as any, "services");
export const useProjects = () => useMergedTable("projects", fallbackProjects as any, "projects");
export const useTechStack = () => useMergedTable("tech_stack", fallbackTechStack as any, "tech_stack");
export const useClients = () => useMergedTable("clients", fallbackClients as any, "clients");
export const useTestimonials = () => useMergedTable("testimonials", fallbackTestimonials as any, "testimonials");
export const useTeam = () => useMergedTable("team_members", fallbackTeam as any, "team");
export const usePricing = () => useMergedTable("pricing_plans", fallbackPricing as any, "pricing");

export function useSponsors() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: rows } = await supabase.from("sponsors" as any).select("*").order("sort_order", { ascending: true });
        if (active && rows) setData(rows.filter((r: any) => r.visible !== false));
      } catch {}
    })();
    return () => { active = false; };
  }, []);
  return data;
}

export function useEvents() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: rows } = await supabase.from("events" as any).select("*").order("created_at", { ascending: false });
        if (active && rows) setData(rows.filter((r: any) => r.visible !== false));
      } catch {}
    })();
    return () => { active = false; };
  }, []);
  return data;
}

export function useDevelopers() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: rows } = await supabase.from("developer_profiles" as any)
          .select("*").eq("status", "active").order("joined_at", { ascending: false });
        if (active && rows) setData(rows);
      } catch {}
    })();
    return () => { active = false; };
  }, []);
  return data;
}

export function useBlogPosts(publishedOnly = true) {
  const [data, setData] = useState<any[]>(
    publishedOnly ? fallbackBlogPosts.filter((p) => p.published) : fallbackBlogPosts
  );
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [postsRes, hiddenRes] = await Promise.all([
          (publishedOnly
            ? supabase.from("blog_posts" as any).select("*").eq("published", true)
            : supabase.from("blog_posts" as any).select("*")
          ).order("created_at", { ascending: false }),
          supabase.from("hidden_fallbacks" as any).select("fallback_id").eq("section", "blog"),
        ]);
        if (!active) return;
        const realRows = (postsRes.data || []).filter((r: any) => r.visible !== false);
        const hiddenIds = new Set((hiddenRes.data || []).map((h: any) => h.fallback_id));
        const baseFallback = publishedOnly ? fallbackBlogPosts.filter((p) => p.published) : fallbackBlogPosts;
        const visibleFallback = baseFallback.filter((f) => !hiddenIds.has(f.id));
        setData([...realRows, ...visibleFallback]);
      } catch {}
    })();
    return () => { active = false; };
  }, [publishedOnly]);
  return data;
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<any | null>(fallbackBlogPosts.find((p) => p.slug === slug) ?? null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const { data: rows, error } = await supabase.from("blog_posts" as any).select("*").eq("slug", slug).limit(1);
        if (!active) return;
        if (!error && rows && rows.length > 0) {
          setPost(rows[0]);
        } else {
          const found = fallbackBlogPosts.find((p) => p.slug === slug);
          if (found) setPost(found);
        }
      } catch {
        const found = fallbackBlogPosts.find((p) => p.slug === slug);
        if (active && found) setPost(found);
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);
  return { post, loading };
}

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, any>>(fallbackContent);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from("site_content" as any).select("key, value");
        if (!active || error || !data) return;
        const merged = { ...fallbackContent };
        data.forEach((row: any) => {
          merged[row.key] = row.value?.v ?? row.value;
        });
        setContent(merged);
      } catch {}
    })();
    return () => { active = false; };
  }, []);
  return content;
}

export async function saveSiteContentKey(key: string, value: any) {
  const { error: upsertErr } = await supabase.from("site_content" as any).upsert({ key, value: { v: value } }, { onConflict: "key" });
  return !upsertErr;
}

export async function hideFallback(section: string, fallbackId: string) {
  const { error } = await supabase.from("hidden_fallbacks" as any).insert({ section, fallback_id: fallbackId });
  return !error;
}

export async function unhideFallback(section: string, fallbackId: string) {
  const { error } = await supabase.from("hidden_fallbacks" as any).delete().eq("section", section).eq("fallback_id", fallbackId);
  return !error;
}

export async function listHiddenFallbacks(section: string) {
  const { data } = await supabase.from("hidden_fallbacks" as any).select("fallback_id").eq("section", section);
  return new Set((data || []).map((d: any) => d.fallback_id));
}
