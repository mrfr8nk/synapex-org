import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  fallbackServices, fallbackProjects, fallbackTechStack,
  fallbackClients, fallbackTestimonials, fallbackTeam,
  fallbackPricing, fallbackContent, fallbackBlogPosts,
} from "./content";

function useTable<T>(table: string, fallback: T[], orderBy = "sort_order") {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: rows, error } = await supabase.from(table as any).select("*").order(orderBy, { ascending: true });
        if (!active) return;
        if (!error && rows && rows.length > 0) setData(rows as T[]);
      } catch {
        // Supabase not configured — keep fallback
      }
    })();
    return () => { active = false; };
  }, [table, orderBy]);
  return data;
}

export const useServices = () => useTable("services", fallbackServices);
export const useProjects = () => useTable("projects", fallbackProjects);
export const useTechStack = () => useTable("tech_stack", fallbackTechStack);
export const useClients = () => useTable("clients", fallbackClients);
export const useTestimonials = () => useTable("testimonials", fallbackTestimonials);
export const useTeam = () => useTable("team_members", fallbackTeam);
export const usePricing = () => useTable("pricing_plans", fallbackPricing);

export function useBlogPosts(publishedOnly = true) {
  const [data, setData] = useState<any[]>(
    publishedOnly ? fallbackBlogPosts.filter((p) => p.published) : fallbackBlogPosts
  );
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let query = supabase.from("blog_posts" as any).select("*").order("created_at", { ascending: false });
        if (publishedOnly) query = (query as any).eq("published", true);
        const { data: rows, error } = await query;
        if (!active) return;
        if (!error && rows && rows.length > 0) setData(rows as any[]);
      } catch {
        // Supabase not configured
      }
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
        if (!error && rows && rows.length > 0) setPost(rows[0]);
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
      } catch {
        // Supabase not configured — keep fallback
      }
    })();
    return () => { active = false; };
  }, []);
  return content;
}
