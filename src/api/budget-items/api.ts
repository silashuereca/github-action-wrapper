import { supabase } from "../../../supabase";
import { TBudgetItem, TBudgetItemCategory } from "./types";

export class BudgetItemApi {
  static async getBudgetItems(budgetMonthId: string): Promise<TBudgetItem[]> {
    const { data, error } = await supabase.from("budget_items").select("*").eq("budget_month_id", budgetMonthId);

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
}
