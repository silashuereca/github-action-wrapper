import { supabase } from "../../../supabase";
import { Database } from "../../../supabase/functions/_shared/database-types";

export type TBudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
export type TBudgetItemCategory = Database["public"]["Tables"]["budget_items"]["Row"]["type"];

export class BudgetItemApi {
  static async getBudgetItem(variables: { id: string }): Promise<TBudgetItem> {
    const { id } = variables;
    const { data, error } = await supabase.from("budget_items").select("*").eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  static async getBudgetItems(budgetMonthId: string): Promise<TBudgetItem[]> {
    const { data, error } = await supabase
      .from("budget_items")
      .select("*")
      .eq("budget_month_id", budgetMonthId)
      .order("created_at", { ascending: true }); // oldest at top, newest at bottom

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async createBudgetItem(variables: {
    amount: number;
    category: TBudgetItemCategory;
    monthId: string;
    name: string;
  }): Promise<{ success: boolean }> {
    const { amount, category, monthId, name } = variables;
    const { error } = await supabase.from("budget_items").insert({
      budget_month_id: monthId,
      budgeted_amount: amount,
      name,
      type: category,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async updateBudgetItem(variables: {
    amount: number;
    id: string;
    name: string;
  }): Promise<{ success: boolean }> {
    const { amount, id, name } = variables;
    const { error } = await supabase
      .from("budget_items")
      .update({
        budgeted_amount: amount,
        name,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}
