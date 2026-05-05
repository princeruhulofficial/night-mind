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
      checkins: {
        Row: {
          created_at: string
          id: string
          kind: string
          messages: Json
          summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          messages?: Json
          summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          messages?: Json
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      credibility_events: {
        Row: {
          category: string
          created_at: string
          delta: number
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          delta: number
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          delta?: number
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patterns: {
        Row: {
          created_at: string
          data: Json | null
          detail: string | null
          id: string
          kind: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          detail?: string | null
          id?: string
          kind?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          detail?: string | null
          id?: string
          kind?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          focus_areas: string[] | null
          id: string
          name: string | null
          onboarded: boolean
          sleep_time: string | null
          updated_at: string
          wake_time: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id: string
          name?: string | null
          onboarded?: boolean
          sleep_time?: string | null
          updated_at?: string
          wake_time?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          name?: string | null
          onboarded?: boolean
          sleep_time?: string | null
          updated_at?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          energy: Database["public"]["Enums"]["task_energy"]
          icon: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          scheduled_for: string
          sort_order: number
          starred: boolean
          status: Database["public"]["Enums"]["task_status"]
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          energy?: Database["public"]["Enums"]["task_energy"]
          icon?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          scheduled_for?: string
          sort_order?: number
          starred?: boolean
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          energy?: Database["public"]["Enums"]["task_energy"]
          icon?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          scheduled_for?: string
          sort_order?: number
          starred?: boolean
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_debriefs: {
        Row: {
          ai_suggestion: string | null
          biggest_blocker: string | null
          completed: number
          completion_rate: number
          created_at: string
          daily_rates: Json | null
          id: string
          skipped: number
          top_win: string | null
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          ai_suggestion?: string | null
          biggest_blocker?: string | null
          completed?: number
          completion_rate?: number
          created_at?: string
          daily_rates?: Json | null
          id?: string
          skipped?: number
          top_win?: string | null
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          ai_suggestion?: string | null
          biggest_blocker?: string | null
          completed?: number
          completion_rate?: number
          created_at?: string
          daily_rates?: Json | null
          id?: string
          skipped?: number
          top_win?: string | null
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      why_answers: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          reason: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          reason: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          reason?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "why_answers_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_leaderboard: {
        Args: never
        Returns: {
          avatar_url: string
          completed_total: number
          completed_week: number
          name: string
          rank: number
          user_id: string
        }[]
      }
    }
    Enums: {
      task_energy: "high" | "medium" | "low"
      task_priority: "high" | "medium" | "low"
      task_status: "pending" | "done" | "skipped"
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
    Enums: {
      task_energy: ["high", "medium", "low"],
      task_priority: ["high", "medium", "low"],
      task_status: ["pending", "done", "skipped"],
    },
  },
} as const
