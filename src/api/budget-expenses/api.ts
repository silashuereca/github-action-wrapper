import { supabase } from "../../../supabase";
import { TBudgetExpenseInsert, TBudgetExpenseRow, TBudgetExpenseUpdate } from "./types";

export class BudgetExpenseApi {
  static async getBudgetExpenses(variables: { id: string }): Promise<TBudgetExpenseRow[]> {
    const { id } = variables;
    const { data, error } = await supabase.from("budget_expenses").select("*").eq("budget_item_id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async createBudgetExpense(variables: TBudgetExpenseInsert): Promise<{ success: boolean }> {
    const { amount, budget_item_id } = variables;
    const { error } = await supabase.from("budget_expenses").insert({
      amount,
      budget_item_id,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async updateBudgetExpense(variables: TBudgetExpenseUpdate): Promise<{ success: boolean }> {
    const { amount, date, id } = variables;
    const { error } = await supabase
      .from("budget_expenses")
      .update({
        amount,
        date,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async deleteBudgetExpense(variables: { id: string }): Promise<{ success: boolean }> {
    const { id } = variables;
    const { error } = await supabase.from("budget_expenses").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}
