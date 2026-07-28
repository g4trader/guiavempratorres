export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          audience: "HOME" | "SITE" | "CATEGORIES";
          business_id: string;
          created_at: string;
          display_order: number;
          ends_at: string;
          id: string;
          internal_path: string;
          placement_id: string;
          priority: number;
          starts_at: string;
          status: Database["public"]["Enums"]["campaign_status"];
          updated_at: string;
        };
        Insert: {
          audience?: "HOME" | "SITE" | "CATEGORIES";
          business_id: string;
          created_at?: string;
          display_order?: number;
          ends_at: string;
          id?: string;
          internal_path: string;
          placement_id: string;
          priority?: number;
          starts_at: string;
          status?: Database["public"]["Enums"]["campaign_status"];
          updated_at?: string;
        };
        Update: {
          audience?: "HOME" | "SITE" | "CATEGORIES";
          business_id?: string;
          created_at?: string;
          display_order?: number;
          ends_at?: string;
          id?: string;
          internal_path?: string;
          placement_id?: string;
          priority?: number;
          starts_at?: string;
          status?: Database["public"]["Enums"]["campaign_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ad_campaigns_placement_id_fkey";
            columns: ["placement_id"];
            isOneToOne: false;
            referencedRelation: "ad_placements";
            referencedColumns: ["id"];
          }
        ];
      };
      ad_campaign_categories: {
        Row: {
          campaign_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          campaign_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          campaign_id?: string;
          category_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ad_campaign_categories_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "ad_campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ad_campaign_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      ad_creatives: {
        Row: {
          campaign_id: string;
          created_at: string;
          description: string | null;
          desktop_image_path: string;
          id: string;
          image_alt: string;
          mobile_image_path: string | null;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          description?: string | null;
          desktop_image_path: string;
          id?: string;
          image_alt: string;
          mobile_image_path?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          description?: string | null;
          desktop_image_path?: string;
          id?: string;
          image_alt?: string;
          mobile_image_path?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ad_creatives_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: true;
            referencedRelation: "ad_campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      ad_placements: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          maximum_active_ads: number;
          name: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          maximum_active_ads: number;
          name: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          maximum_active_ads?: number;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_roles: {
        Row: {
          created_at: string;
          role: Database["public"]["Enums"]["admin_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_table: string;
          id: number;
          new_data: Json | null;
          old_data: Json | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_table: string;
          id?: never;
          new_data?: Json | null;
          old_data?: Json | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_table?: string;
          id?: never;
          new_data?: Json | null;
          old_data?: Json | null;
        };
        Relationships: [];
      };
      business_categories: {
        Row: {
          business_id: string;
          category_id: string;
          created_at: string;
          is_primary: boolean;
        };
        Insert: {
          business_id: string;
          category_id: string;
          created_at?: string;
          is_primary?: boolean;
        };
        Update: {
          business_id?: string;
          category_id?: string;
          created_at?: string;
          is_primary?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "business_categories_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "business_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      business_hours: {
        Row: {
          business_id: string;
          closes_at: string | null;
          created_at: string;
          day_of_week: number;
          id: string;
          is_closed: boolean;
          opens_at: string | null;
          updated_at: string;
        };
        Insert: {
          business_id: string;
          closes_at?: string | null;
          created_at?: string;
          day_of_week: number;
          id?: string;
          is_closed?: boolean;
          opens_at?: string | null;
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          closes_at?: string | null;
          created_at?: string;
          day_of_week?: number;
          id?: string;
          is_closed?: boolean;
          opens_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      business_items: {
        Row: {
          active: boolean;
          business_id: string;
          created_at: string;
          cta_label: string | null;
          cta_url: string | null;
          description: string | null;
          display_order: number;
          id: string;
          image: string | null;
          price: number | null;
          title: string;
          type: Database["public"]["Enums"]["business_item_type"];
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          business_id: string;
          created_at?: string;
          cta_label?: string | null;
          cta_url?: string | null;
          description?: string | null;
          display_order?: number;
          id?: string;
          image?: string | null;
          price?: number | null;
          title: string;
          type: Database["public"]["Enums"]["business_item_type"];
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          business_id?: string;
          created_at?: string;
          cta_label?: string | null;
          cta_url?: string | null;
          description?: string | null;
          display_order?: number;
          id?: string;
          image?: string | null;
          price?: number | null;
          title?: string;
          type?: Database["public"]["Enums"]["business_item_type"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "business_items_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      business_media: {
        Row: {
          business_id: string;
          created_at: string;
          display_order: number;
          id: string;
          image_alt: string;
          is_active: boolean;
          kind: Database["public"]["Enums"]["media_kind"];
          storage_path: string;
          updated_at: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          display_order?: number;
          id?: string;
          image_alt: string;
          is_active?: boolean;
          kind: Database["public"]["Enums"]["media_kind"];
          storage_path: string;
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          display_order?: number;
          id?: string;
          image_alt?: string;
          is_active?: boolean;
          kind?: Database["public"]["Enums"]["media_kind"];
          storage_path?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "business_media_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      businesses: {
        Row: {
          featured_home: boolean;
          featured_home_ends_at: string | null;
          featured_home_order: number;
          featured_home_starts_at: string | null;
          address_line: string | null;
          city: string;
          created_at: string;
          description: string | null;
          email: string | null;
          hero_image_alt: string | null;
          hero_image_path: string | null;
          id: string;
          instagram_url: string | null;
          latitude: number | null;
          logo_path: string | null;
          longitude: number | null;
          name: string;
          neighborhood: string | null;
          phone: string | null;
          plan_id: string;
          postal_code: string | null;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          short_description: string | null;
          slug: string;
          state: string;
          status: Database["public"]["Enums"]["business_status"];
          updated_at: string;
          website_url: string | null;
          whatsapp: string | null;
        };
        Insert: {
          featured_home?: boolean;
          featured_home_ends_at?: string | null;
          featured_home_order?: number;
          featured_home_starts_at?: string | null;
          address_line?: string | null;
          city?: string;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          hero_image_alt?: string | null;
          hero_image_path?: string | null;
          id?: string;
          instagram_url?: string | null;
          latitude?: number | null;
          logo_path?: string | null;
          longitude?: number | null;
          name: string;
          neighborhood?: string | null;
          phone?: string | null;
          plan_id: string;
          postal_code?: string | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          short_description?: string | null;
          slug: string;
          state?: string;
          status?: Database["public"]["Enums"]["business_status"];
          updated_at?: string;
          website_url?: string | null;
          whatsapp?: string | null;
        };
        Update: {
          featured_home?: boolean;
          featured_home_ends_at?: string | null;
          featured_home_order?: number;
          featured_home_starts_at?: string | null;
          address_line?: string | null;
          city?: string;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          hero_image_alt?: string | null;
          hero_image_path?: string | null;
          id?: string;
          instagram_url?: string | null;
          latitude?: number | null;
          logo_path?: string | null;
          longitude?: number | null;
          name?: string;
          neighborhood?: string | null;
          phone?: string | null;
          plan_id?: string;
          postal_code?: string | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          short_description?: string | null;
          slug?: string;
          state?: string;
          status?: Database["public"]["Enums"]["business_status"];
          updated_at?: string;
          website_url?: string | null;
          whatsapp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          display_order: number;
          id: string;
          image_alt: string | null;
          image_path: string | null;
          is_active: boolean;
          name: string;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          image_alt?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          name: string;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          image_alt?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          name?: string;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plans: {
        Row: {
          created_at: string;
          featured_category: boolean;
          featured_home: boolean;
          gallery_enabled: boolean;
          hero_allowed: boolean;
          id: string;
          instagram_enabled: boolean;
          max_images: number;
          max_items: number;
          name: string;
          premium_badge: boolean;
          priority: number;
          slug: string;
          updated_at: string;
          video_enabled: boolean;
          website_enabled: boolean;
          whatsapp_enabled: boolean;
        };
        Insert: {
          created_at?: string;
          featured_category?: boolean;
          featured_home?: boolean;
          gallery_enabled?: boolean;
          hero_allowed?: boolean;
          id?: string;
          instagram_enabled?: boolean;
          max_images?: number;
          max_items?: number;
          name: string;
          premium_badge?: boolean;
          priority?: number;
          slug: string;
          updated_at?: string;
          video_enabled?: boolean;
          website_enabled?: boolean;
          whatsapp_enabled?: boolean;
        };
        Update: {
          created_at?: string;
          featured_category?: boolean;
          featured_home?: boolean;
          gallery_enabled?: boolean;
          hero_allowed?: boolean;
          id?: string;
          instagram_enabled?: boolean;
          max_images?: number;
          max_items?: number;
          name?: string;
          premium_badge?: boolean;
          priority?: number;
          slug?: string;
          updated_at?: string;
          video_enabled?: boolean;
          website_enabled?: boolean;
          whatsapp_enabled?: boolean;
        };
        Relationships: [];
      };
      products_services: {
        Row: {
          business_id: string;
          created_at: string;
          cta_label: string | null;
          cta_url: string | null;
          currency: string;
          description: string | null;
          display_order: number;
          id: string;
          image_alt: string | null;
          image_path: string | null;
          is_active: boolean;
          name: string;
          price: number | null;
          type: Database["public"]["Enums"]["item_type"];
          updated_at: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          cta_label?: string | null;
          cta_url?: string | null;
          currency?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          image_alt?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          name: string;
          price?: number | null;
          type: Database["public"]["Enums"]["item_type"];
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          cta_label?: string | null;
          cta_url?: string | null;
          currency?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          image_alt?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          name?: string;
          price?: number | null;
          type?: Database["public"]["Enums"]["item_type"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_services_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_admin_role: {
        Args: { allowed: Database["public"]["Enums"]["admin_role"][] };
        Returns: boolean;
      };
    };
    Enums: {
      admin_role: "super_admin" | "admin" | "editor";
      business_item_type: "PRODUCT" | "SERVICE" | "PROMOTION" | "MENU" | "CATALOG";
      business_status: "draft" | "published" | "suspended" | "archived";
      campaign_status: "draft" | "active" | "paused" | "archived";
      item_type: "product" | "service";
      media_kind: "logo" | "hero" | "gallery";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {}
  },
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "editor"],
      business_item_type: ["PRODUCT", "SERVICE", "PROMOTION", "MENU", "CATALOG"],
      business_status: ["draft", "published", "suspended", "archived"],
      campaign_status: ["draft", "active", "paused", "archived"],
      item_type: ["product", "service"],
      media_kind: ["logo", "hero", "gallery"]
    }
  }
} as const;
