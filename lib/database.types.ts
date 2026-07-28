export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_path: string | null;
          image_alt: string | null;
          display_order: number;
          is_active: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          logo_path: string | null;
          hero_image_path: string | null;
          hero_image_alt: string | null;
          status: Database["public"]["Enums"]["business_status"];
          address_line: string | null;
          neighborhood: string | null;
          city: string;
          state: string;
          postal_code: string | null;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          website_url: string | null;
          instagram_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["businesses"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
        Relationships: [];
      };
      business_categories: {
        Row: {
          business_id: string;
          category_id: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["business_categories"]["Row"];
        Update: Partial<Database["public"]["Tables"]["business_categories"]["Insert"]>;
        Relationships: [];
      };
      products_services: {
        Row: {
          id: string;
          business_id: string;
          type: Database["public"]["Enums"]["item_type"];
          name: string;
          description: string | null;
          image_path: string | null;
          image_alt: string | null;
          price: number | null;
          currency: string;
          cta_label: string | null;
          cta_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products_services"]["Row"]> & {
          business_id: string;
          type: Database["public"]["Enums"]["item_type"];
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["products_services"]["Insert"]>;
        Relationships: [];
      };
      ad_placements: {
        Row: {
          id: string;
          code: string;
          name: string;
          maximum_active_ads: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ad_placements"]["Row"]> & {
          code: string;
          name: string;
          maximum_active_ads: number;
        };
        Update: Partial<Database["public"]["Tables"]["ad_placements"]["Insert"]>;
        Relationships: [];
      };
      ad_campaigns: {
        Row: {
          id: string;
          business_id: string;
          placement_id: string;
          status: Database["public"]["Enums"]["campaign_status"];
          starts_at: string;
          ends_at: string;
          display_order: number;
          priority: number;
          internal_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ad_campaigns"]["Row"]> & {
          business_id: string;
          placement_id: string;
          starts_at: string;
          ends_at: string;
          internal_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["ad_campaigns"]["Insert"]>;
        Relationships: [];
      };
      ad_creatives: {
        Row: {
          id: string;
          campaign_id: string;
          desktop_image_path: string;
          mobile_image_path: string | null;
          image_alt: string;
          title: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ad_creatives"]["Row"]> & {
          campaign_id: string;
          desktop_image_path: string;
          image_alt: string;
        };
        Update: Partial<Database["public"]["Tables"]["ad_creatives"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_admin_role: {
        Args: { allowed: Database["public"]["Enums"]["admin_role"][] };
        Returns: boolean;
      };
    };
    Enums: {
      admin_role: "super_admin" | "admin" | "editor";
      business_status: "draft" | "published" | "suspended" | "archived";
      item_type: "product" | "service";
      campaign_status: "draft" | "active" | "paused" | "archived";
      media_kind: "logo" | "hero" | "gallery";
    };
    CompositeTypes: Record<string, never>;
  };
};
