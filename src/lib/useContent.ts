import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  fallbackServices, fallbackProjects, fallbackTechStack,
  fallbackClients, fallbackTestimonials, fallbackTeam,
  fallbackPricing, fallbackContent,
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

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, any>>(fallbackContent);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from("site_content").select("key, value");
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
