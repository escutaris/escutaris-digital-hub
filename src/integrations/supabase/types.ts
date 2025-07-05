export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_suggestions: {
        Row: {
          area_code: string | null
          description: string | null
          id: string
          level: string | null
        }
        Insert: {
          area_code?: string | null
          description?: string | null
          id?: string
          level?: string | null
        }
        Update: {
          area_code?: string | null
          description?: string | null
          id?: string
          level?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          action_plan_note: string | null
          avg_area_1: number | null
          avg_area_2: number | null
          avg_area_3: number | null
          avg_area_4: number | null
          id: string
          overall_avg: number | null
          submitted_at: string | null
          user_id: string | null
          weaker_area: string | null
        }
        Insert: {
          action_plan_note?: string | null
          avg_area_1?: number | null
          avg_area_2?: number | null
          avg_area_3?: number | null
          avg_area_4?: number | null
          id?: string
          overall_avg?: number | null
          submitted_at?: string | null
          user_id?: string | null
          weaker_area?: string | null
        }
        Update: {
          action_plan_note?: string | null
          avg_area_1?: number | null
          avg_area_2?: number | null
          avg_area_3?: number | null
          avg_area_4?: number | null
          id?: string
          overall_avg?: number | null
          submitted_at?: string | null
          user_id?: string | null
          weaker_area?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      download_history: {
        Row: {
          downloaded_at: string
          id: string
          ip_address: string | null
          material_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          material_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          material_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_history_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_triagem: {
        Row: {
          created_at: string | null
          data_exame: string
          id: string
          interpreta_risco: string | null
          media_apoio: number | null
          media_controle: number | null
          media_demandas: number | null
          media_equilibrio: number | null
          media_mudancas: number | null
          media_papeis: number | null
          media_relacionamento: number | null
          respostas: Json
          risco_burnout: boolean | null
          risco_conflito: boolean | null
          risco_estresse: boolean | null
          risco_geral: boolean | null
          tipo_exame: string | null
          trabalhador_id: string
        }
        Insert: {
          created_at?: string | null
          data_exame?: string
          id?: string
          interpreta_risco?: string | null
          media_apoio?: number | null
          media_controle?: number | null
          media_demandas?: number | null
          media_equilibrio?: number | null
          media_mudancas?: number | null
          media_papeis?: number | null
          media_relacionamento?: number | null
          respostas: Json
          risco_burnout?: boolean | null
          risco_conflito?: boolean | null
          risco_estresse?: boolean | null
          risco_geral?: boolean | null
          tipo_exame?: string | null
          trabalhador_id: string
        }
        Update: {
          created_at?: string | null
          data_exame?: string
          id?: string
          interpreta_risco?: string | null
          media_apoio?: number | null
          media_controle?: number | null
          media_demandas?: number | null
          media_equilibrio?: number | null
          media_mudancas?: number | null
          media_papeis?: number | null
          media_relacionamento?: number | null
          respostas?: Json
          risco_burnout?: boolean | null
          risco_conflito?: boolean | null
          risco_estresse?: boolean | null
          risco_geral?: boolean | null
          tipo_exame?: string | null
          trabalhador_id?: string
        }
        Relationships: []
      }
      leadership_assessments: {
        Row: {
          answers: Json
          area_1_average: number | null
          area_2_average: number | null
          area_3_average: number | null
          area_4_average: number | null
          classification: string
          created_at: string
          id: string
          overall_average: number
          recommendations: string[] | null
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          answers: Json
          area_1_average?: number | null
          area_2_average?: number | null
          area_3_average?: number | null
          area_4_average?: number | null
          classification: string
          created_at?: string
          id?: string
          overall_average: number
          recommendations?: string[] | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          answers?: Json
          area_1_average?: number | null
          area_2_average?: number | null
          area_3_average?: number | null
          area_4_average?: number | null
          classification?: string
          created_at?: string
          id?: string
          overall_average?: number
          recommendations?: string[] | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          accept_marketing: boolean
          created_at: string
          email: string
          id: string
        }
        Insert: {
          accept_marketing?: boolean
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          accept_marketing?: boolean
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string | null
          email: string
          id: string
          ip_address: string | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          is_new: boolean | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          is_new?: boolean | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          is_new?: boolean | null
          title?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string
          description: string
          id: string
          is_featured: boolean
          is_published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          crm: string | null
          id: string
          name: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          area?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          crm?: string | null
          id: string
          name?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          area?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          crm?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          material_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          material_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          material_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          group_name: string | null
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          group_name?: string | null
          id: string
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          group_name?: string | null
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
