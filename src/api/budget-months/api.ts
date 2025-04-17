import { supabase } from "../../../supabase";
import { TBudgetMonth } from "./types";

export class BudgetMonthApi {
  static async getBudgetMonth(variables: { month?: string; monthId?: string }): Promise<TBudgetMonth | null> {
    const { month, monthId } = variables;

    let data: TBudgetMonth[] = [];
    let error: Error | null = null;

    if (monthId) {
      const result = await supabase.from("budget_months").select("*").eq("id", monthId);
      data = result.data;
      error = result.error;
    } else if (month) {
      const result = await supabase.from("budget_months").select("*").eq("month_start", month);
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw new Error(error.message);
    }

    return data[0] || null;
  }
}
