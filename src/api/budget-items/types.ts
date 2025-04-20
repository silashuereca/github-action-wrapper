import { Database } from "../../../supabase/functions/_shared/types";

export type TBudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
export type TBudgetItemCategory = Database["public"]["Tables"]["budget_items"]["Row"]["type"];
