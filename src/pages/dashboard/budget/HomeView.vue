<template>
  <div class="w-full flex justify-center">
    <Card class="w-full sm:max-w-2xl">
      <template #content>
        <section>
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <DatePicker
                :model-value="state.selectedMonth"
                view="month"
                date-format="MM"
                @update:model-value="selectMonth"
              />
            </div>
    
            <div v-show="!state.loading.budgetMonth && !state.budgetMonth" class="flex justify-end">
              <Button label="Create Budget" type="button" severity="contrast" @click="createBudget()" />
            </div>
          </div>

          <div v-for="item, key in state.budgetItems" :key="key" class="mb-5">
            <Panel :header="renderTypeHeader(key)">
              <ul>
                <li v-for="budgetItem in item" :key="budgetItem.id" class="mb-3">
                  <div class="flex justify-between w-full border-b border-gray-200 pb-2">
                    <p v-text="budgetItem.name" />
                    <p v-text="budgetItem.budgeted_amount" />
                  </div>
                </li>
              </ul>
            </Panel>
          </div>
        </section>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from "luxon";
import { Button, Card, DatePicker, Panel } from "primevue";
import { onMounted, reactive } from "vue";

import { supabase } from "../../../../supabase";
import { BudgetItemApi } from "../../../api/budget-items/api";
import { TBudgetItem } from "../../../api/budget-items/types";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import { BudgetMonthApi } from "../../../api/budget-months/api";
import { TBudgetMonth } from "../../../api/budget-months/types";

type TState = {
  budgetItems: Record<TBudgetItem["type"], TBudgetItem[]> | null;
  budgetMonth: TBudgetMonth | null;
  loading: {
    budgetMonth: boolean;
  };
  selectedMonth: Date;
};

const state: TState = reactive({
  budgetItems: null,
  budgetMonth: null,
  loading: {
    budgetMonth: true,
  },
  selectedMonth: null,
});

onMounted(() => {
  setDefaultDate();
});

function getMonthString(date: Date): string {
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
}

async function setDefaultDate(): Promise<void> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  state.selectedMonth = firstOfMonth;

  try {
    const month = getMonthString(state.selectedMonth);
    const result = await BudgetMonthApi.getBudgetMonth(month);
    if (result) {
      state.budgetMonth = result;

      const budgetItems = await BudgetItemApi.getBudgetItems(state.budgetMonth.id);
      state.budgetItems = groupBudgetItems(budgetItems);
    }
  } finally {
    state.loading.budgetMonth = false;
  }
}

function selectMonth(value: Date): void {
  state.selectedMonth = value;
}

function groupBudgetItems(items: TBudgetItem[]): Record<string, TBudgetItem[]> {
  return items.reduce(
    (acc, item) => {
      const key = item.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, TBudgetItem[]>,
  );
}

async function createBudget(): Promise<void> {
  const { data, error } = await supabase.functions.invoke("create-budget", { body: { month: state.selectedMonth } });
  console.log("Data", data);
  console.log("Error", error);
}
</script>
