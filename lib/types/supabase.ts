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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          prefix: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          prefix?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          prefix?: string | null
        }
        Relationships: []
      }
      mops: {
        Row: {
          category_id: number | null
          created_at: string
          document_number: string
          file_url: string | null
          id: number
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          document_number: string
          file_url?: string | null
          id?: number
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          document_number?: string
          file_url?: string | null
          id?: number
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          division: string | null
          email: string | null
          fullname: string | null
          id: string
          role_id: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          division?: string | null
          email?: string | null
          fullname?: string | null
          id: string
          role_id?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          division?: string | null
          email?: string | null
          fullname?: string | null
          id?: string
          role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_evidences: {
        Row: {
          action_description: string | null
          action_image_url: string | null
          action_title: string | null
          created_at: string
          id: number
          outcome_description: string | null
          outcome_image_url: string | null
          outcome_title: string | null
          report_id: number
        }
        Insert: {
          action_description?: string | null
          action_image_url?: string | null
          action_title?: string | null
          created_at?: string
          id?: number
          outcome_description?: string | null
          outcome_image_url?: string | null
          outcome_title?: string | null
          report_id: number
        }
        Update: {
          action_description?: string | null
          action_image_url?: string | null
          action_title?: string | null
          created_at?: string
          id?: number
          outcome_description?: string | null
          outcome_image_url?: string | null
          outcome_title?: string | null
          report_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "report_evidences_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: number
          rejection_notes: string | null
          status: string | null
          submitted_at: string | null
          supervisor_name: string | null
          task_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          rejection_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          supervisor_name?: string | null
          task_id: number
        }
        Update: {
          created_at?: string
          id?: number
          rejection_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          supervisor_name?: string | null
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reports_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: number
          mop_id: number
          pic_id: string
          scheduled_date: string
          status: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: number
          mop_id: number
          pic_id: string
          scheduled_date: string
          status?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: number
          mop_id?: number
          pic_id?: string
          scheduled_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_mop_id_fkey"
            columns: ["mop_id"]
            isOneToOne: false
            referencedRelation: "mops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_pic_id_fkey"
            columns: ["pic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
