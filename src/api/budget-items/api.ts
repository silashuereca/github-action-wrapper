import { supabase } from "../../../supabase";
import { TBudgetItem } from "./types";

export class BudgetItemApi {
  static async getBudgetItems(budgetMonthId: string): Promise<TBudgetItem[]> {
    const { data, error } = await supabase.from("budget_items").select("*").eq("budget_month_id", budgetMonthId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
