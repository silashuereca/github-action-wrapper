/* eslint-disable no-unused-vars */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
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
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
  };
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      budget_category_type:
        | "income"
        | "insurance"
        | "personal"
        | "debt"
        | "health"
        | "giving"
        | "savings"
        | "housing"
        | "transportation"
        | "food"
        | "lifestyle";
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      budget_expenses: {
        Insert: {
          amount: number;
          budget_item_id?: string | null;
          created_at?: string | null;
          date?: string;
          id?: string;
          name: string;
        };
        Relationships: [
          {
            columns: ["budget_item_id"];
            foreignKeyName: "budget_expenses_budget_item_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_items";
          },
        ];
        Row: {
          amount: number;
          budget_item_id: string | null;
          created_at: string | null;
          date: string;
          id: string;
          name: string;
        };
        Update: {
          amount?: number;
          budget_item_id?: string | null;
          created_at?: string | null;
          date?: string;
          id?: string;
          name?: string;
        };
      };
      budget_items: {
        Insert: {
          budget_month_id?: string | null;
          budgeted_amount?: number;
          created_at?: string | null;
          id?: string;
          is_paid?: boolean | null;
          is_recurring?: boolean | null;
          name: string;
          type: Database["public"]["Enums"]["budget_category_type"];
        };
        Relationships: [
          {
            columns: ["budget_month_id"];
            foreignKeyName: "budget_items_budget_month_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_months";
          },
        ];
        Row: {
          budget_month_id: string | null;
          budgeted_amount: number;
          created_at: string | null;
          id: string;
          is_paid: boolean | null;
          is_recurring: boolean | null;
          name: string;
          type: Database["public"]["Enums"]["budget_category_type"];
        };
        Update: {
          budget_month_id?: string | null;
          budgeted_amount?: number;
          created_at?: string | null;
          id?: string;
          is_paid?: boolean | null;
          is_recurring?: boolean | null;
          name?: string;
          type?: Database["public"]["Enums"]["budget_category_type"];
        };
      };
      budget_months: {
        Insert: {
          created_at?: string | null;
          id?: string;
          month_start: string;
          user_id?: string | null;
        };
        Relationships: [];
        Row: {
          created_at: string | null;
          id: string;
          month_start: string;
          user_id: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          month_start?: string;
          user_id?: string | null;
        };
      };
    };
    Views: {
      budget_month_summary: {
        Relationships: [
          {
            columns: ["budget_month_id"];
            foreignKeyName: "budget_items_budget_month_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_months";
          },
        ];
        Row: {
          budget_month_id: string | null;
          paid_items: number | null;
          percent_paid: number | null;
          total_budgeted: number | null;
          total_items: number | null;
          type: Database["public"]["Enums"]["budget_category_type"] | null;
        };
      };
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      budget_category_type: [
        "income",
        "insurance",
        "personal",
        "debt",
        "health",
        "giving",
        "savings",
        "housing",
        "transportation",
        "food",
        "lifestyle",
      ],
    },
  },
} as const;
