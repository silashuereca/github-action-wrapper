import { supabase } from "../../../supabase";
import { TBudgetMonth } from "./types";

export class BudgetMonthApi {
  static async getBudgetMonth(month: string): Promise<TBudgetMonth> {
    const { data, error } = await supabase.from("budget_months").select("*").eq("month_start", month).single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
