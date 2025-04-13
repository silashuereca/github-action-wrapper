import { Database } from "../../../supabase/functions/_shared/types";

export type TBudgetMonth = Database["public"]["Tables"]["budget_months"]["Row"];
