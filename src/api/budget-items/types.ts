import { Database } from "../../../supabase/functions/_shared/types";

export type TBudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
