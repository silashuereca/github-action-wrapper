import { supabase } from "../../../supabase";
import { Database } from "../../../supabase/functions/_shared/database-types";

export type TBudgetExpenseRow = Database["public"]["Tables"]["budget_expenses"]["Row"];
export type TBudgetExpenseInsert = Database["public"]["Tables"]["budget_expenses"]["Insert"];
export type TBudgetExpenseUpdate = Database["public"]["Tables"]["budget_expenses"]["Update"];

export class BudgetExpenseApi {
  static async getBudgetExpenses(variables: { id: string }): Promise<TBudgetExpenseRow[]> {
    const { id } = variables;
    const { data, error } = await supabase.from("budget_expenses").select("*").eq("budget_item_id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async createBudgetExpense(variables: {
    amount: number;
    budget_item_id: string;
    name: string;
  }): Promise<{ success: boolean }> {
    const { amount, budget_item_id, name } = variables;
    const { error } = await supabase.from("budget_expenses").insert({
      amount,
      budget_item_id,
      name,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async updateBudgetExpense(variables: TBudgetExpenseUpdate): Promise<{ success: boolean }> {
    const { amount, id, name } = variables;
    const { error } = await supabase
      .from("budget_expenses")
      .update({
        amount,
        name,
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
