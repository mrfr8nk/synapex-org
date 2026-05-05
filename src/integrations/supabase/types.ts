export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: number
          image_url: string | null
          pending_approval: boolean
          published: boolean | null
          slug: string
          submitted_by_user_id: string | null
          summary: string | null
          title: string
          visible: boolean
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: never
          image_url?: string | null
          pending_approval?: boolean
          published?: boolean | null
          slug: string
          submitted_by_user_id?: string | null
          summary?: string | null
          title: string
          visible?: boolean
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: never
          image_url?: string | null
          pending_approval?: boolean
          published?: boolean | null
          slug?: string
          submitted_by_user_id?: string | null
          summary?: string | null
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          visible: boolean
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          visible?: boolean
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          visible?: boolean
          website_url?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean
          subject?: string | null
        }
        Relationships: []
      }
      developer_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          github_url: string | null
          id: string
          joined_at: string | null
          last_seen: string | null
          location: string | null
          name: string
          portfolio_url: string | null
          role: string | null
          skills: string[] | null
          status: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          github_url?: string | null
          id?: string
          joined_at?: string | null
          last_seen?: string | null
          location?: string | null
          name?: string
          portfolio_url?: string | null
          role?: string | null
          skills?: string[] | null
          status?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          github_url?: string | null
          id?: string
          joined_at?: string | null
          last_seen?: string | null
          location?: string | null
          name?: string
          portfolio_url?: string | null
          role?: string | null
          skills?: string[] | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          body: string | null
          created_at: string
          event_date: string | null
          id: string
          image_url: string | null
          link_url: string | null
          sort_order: number
          summary: string | null
          title: string
          type: string
          visible: boolean
        }
        Insert: {
          body?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          sort_order?: number
          summary?: string | null
          title: string
          type?: string
          visible?: boolean
        }
        Update: {
          body?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          sort_order?: number
          summary?: string | null
          title?: string
          type?: string
          visible?: boolean
        }
        Relationships: []
      }
      hidden_fallbacks: {
        Row: {
          created_at: string
          fallback_id: string
          id: string
          section: string
        }
        Insert: {
          created_at?: string
          fallback_id: string
          id?: string
          section: string
        }
        Update: {
          created_at?: string
          fallback_id?: string
          id?: string
          section?: string
        }
        Relationships: []
      }
      magic_link_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token_hash: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          token_hash: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token_hash?: string
          used?: boolean
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string | null
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          created_at: string
          description: string
          features: string[]
          id: string
          is_popular: boolean
          name: string
          price: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          features?: string[]
          id?: string
          is_popular?: boolean
          name: string
          price: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          is_popular?: boolean
          name?: string
          price?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      project_collaborators: {
        Row: {
          created_at: string
          developer_email: string | null
          developer_name: string | null
          id: string
          message: string | null
          project_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          developer_email?: string | null
          developer_name?: string | null
          id?: string
          message?: string | null
          project_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          developer_email?: string | null
          developer_name?: string | null
          id?: string
          message?: string | null
          project_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          content: string
          created_at: string
          developer_name: string | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          developer_name?: string | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          developer_name?: string | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          created_at: string
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          is_open: boolean
          live_url: string | null
          sort_order: number
          tech: string[]
          title: string
          visible: boolean
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean
          live_url?: string | null
          sort_order?: number
          tech?: string[]
          title: string
          visible?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean
          live_url?: string | null
          sort_order?: number
          tech?: string[]
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          sort_order: number
          title: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          sort_order?: number
          title: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      sponsor_applications: {
        Row: {
          amount: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          read: boolean
        }
        Insert: {
          amount?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          read?: boolean
        }
        Update: {
          amount?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          read?: boolean
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          message: string | null
          name: string
          sort_order: number
          tier: string | null
          visible: boolean
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          message?: string | null
          name: string
          sort_order?: number
          tier?: string | null
          visible?: boolean
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          message?: string | null
          name?: string
          sort_order?: number
          tier?: string | null
          visible?: boolean
          website_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          github_url: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          role: string
          sort_order: number
          twitter_url: string | null
          visible: boolean
        }
        Insert: {
          bio?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          role: string
          sort_order?: number
          twitter_url?: string | null
          visible?: boolean
        }
        Update: {
          bio?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          role?: string
          sort_order?: number
          twitter_url?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      tech_stack: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          quote: string
          rating: number
          role: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          quote: string
          rating?: number
          role: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          quote?: string
          rating?: number
          role?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
