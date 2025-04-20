import { createClient } from "npm:@supabase/supabase-js";
import { DateTime } from "npm:luxon";

import { corsHeaders } from "../_shared/cores.ts";
import { Database } from "../_shared/types.ts";

// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      // eslint-disable-next-line no-undef
      Deno.env.get("SUPABASE_URL") ?? "",
      // eslint-disable-next-line no-undef
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    // Get the session or user object
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { month: monthRequest } = await req.json();
    const selectedMonth = DateTime.fromISO(monthRequest).toFormat("yyyy-MM-dd");

    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { data: latestMonthRow } = await supabaseClient
      .from("budget_months")
      .select("*")
      .eq("user_id", user.id)
      .order("month_start", { ascending: false })
      .limit(1);
    const { data: currentMonthRows } = await supabaseClient
      .from("budget_months")
      .select("*")
      .eq("month_start", selectedMonth);

    if (latestMonthRow?.length && latestMonthRow[0].month_start !== selectedMonth) {
      const { data: rows } = await supabaseClient
        .from("budget_items")
        .select("*")
        .eq("budget_month_id", latestMonthRow[0].id);

      await supabaseClient.from("budget_months").insert({
        month_start: selectedMonth,
        user_id: user.id,
      });

      const getCreatedMonth = await supabaseClient
        .from("budget_months")
        .select("*")
        .eq("user_id", user.id)
        .eq("month_start", selectedMonth);

      const createdMonth = getCreatedMonth.data;
      if (createdMonth?.length) {
        const budgetItem = {
          budget_month_id: createdMonth[0].id,
          budgeted_amount: 0,
          is_paid: false,
          is_recurring: false,
        };
        const budgetItems = rows?.map((row) => {
          return {
            ...budgetItem,
            name: row.name,
            type: row.type,
          };
        });

        if (budgetItems?.length) {
          await supabaseClient.from("budget_items").insert(budgetItems);
        }
      }
    } else if (!currentMonthRows?.length) {
      // create a new budget month here
      await supabaseClient.from("budget_months").insert({
        month_start: selectedMonth,
        user_id: user.id,
      });
      const getCreatedMonth = await supabaseClient
        .from("budget_months")
        .select("*")
        .eq("user_id", user.id)
        .eq("month_start", selectedMonth);

      const createdMonth = getCreatedMonth.data;
      if (createdMonth?.length) {
        const createdMonthId = createdMonth[0].id;
        const budgetItem = {
          budget_month_id: createdMonthId,
          budgeted_amount: 0,
          is_paid: false,
          is_recurring: false,
        };

        await supabaseClient.from("budget_items").insert([
          {
            ...budgetItem,
            name: "Paycheck 1",
            type: "income",
          },
          {
            ...budgetItem,
            name: "Paycheck 2",
            type: "income",
          },
          {
            ...budgetItem,
            name: "Savings",
            type: "savings",
          },
          {
            ...budgetItem,
            name: "Mortgage/Rent",
            type: "housing",
          },
          {
            ...budgetItem,
            name: "Gas",
            type: "transportation",
          },
          {
            ...budgetItem,
            name: "Groceries",
            type: "food",
          },
          {
            ...budgetItem,
            name: "Cell Phone",
            type: "personal",
          },
          {
            ...budgetItem,
            name: "Gym Membership",
            type: "lifestyle",
          },
          {
            ...budgetItem,
            name: "Doctor Visit",
            type: "health",
          },
          {
            ...budgetItem,
            name: "Car Insurance",
            type: "insurance",
          },
          {
            ...budgetItem,
            name: "Credit Card",
            type: "debt",
          },
        ]);
      }
    }

    //I think the return response needs to just say it was successful
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
