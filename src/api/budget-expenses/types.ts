import { Database } from "../../../supabase/functions/_shared/types";

export type TBudgetExpenseRow = Database["public"]["Tables"]["budget_expenses"]["Row"];
export type TBudgetExpenseInsert = Database["public"]["Tables"]["budget_expenses"]["Insert"];
export type TBudgetExpenseUpdate = Database["public"]["Tables"]["budget_expenses"]["Update"];
