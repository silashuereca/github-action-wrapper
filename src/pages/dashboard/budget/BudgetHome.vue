<template>
  <div class="w-full flex justify-center">
    <Card class="w-full">
      <template #content>
        <section>
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <DatePicker
                :model-value="state.selectedMonth"
                view="month"
                date-format="MM-yy"
                @update:model-value="selectMonth"
              />
            </div>
    
            <div v-show="!state.loading.budgetMonth && !state.budgetMonth" class="flex justify-end">
              <Button
                label="Create Budget"
                type="button"
                severity="contrast"
                :loading="state.loading.creatingBudget"
                @click="createBudget()"
              />
            </div>
          </div>

          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="item, key in state.budgetItems" :key="key" class="mb-5">
              <Panel :header="renderTypeHeader(key)">
                <ul>
                  <li v-for="budgetItem in item" :key="budgetItem.id" class="mb-3">
                    <EditBudgetItem :budget-item="budgetItem" />
                  </li>
                  <li class="w-full">
                    <CreateBudgetItem :month-id="state.budgetMonth.id" :category="key" @update:list="refreshBudgetItems()" />
                  </li>
                </ul>
              </Panel>
            </div>
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
import { useRoute, useRouter } from "vue-router";

import { supabase } from "../../../../supabase";
import { BudgetItemApi } from "../../../api/budget-items/api";
import { TBudgetItem } from "../../../api/budget-items/types";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import { BudgetMonthApi } from "../../../api/budget-months/api";
import { TBudgetMonth } from "../../../api/budget-months/types";
import CreateBudgetItem from "../../../components/budget/CreateBudgetItem.vue";
import EditBudgetItem from "../../../components/budget/EditBudgetItem.vue";

type TState = {
  budgetItems: Record<TBudgetItem["type"], TBudgetItem[]> | null;
  budgetMonth: TBudgetMonth | null;
  loading: {
    budgetMonth: boolean;
    creatingBudget: boolean;
  };
  selectedMonth: Date;
};

const route = useRoute();
const router = useRouter();
const state: TState = reactive({
  budgetItems: null,
  budgetMonth: null,
  loading: {
    budgetMonth: true,
    creatingBudget: false,
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
    const result = await BudgetMonthApi.getBudgetMonth({ month, monthId: route.params.id as string });
    if (result) {
      state.budgetMonth = result;
      const budgetItems = await BudgetItemApi.getBudgetItems(state.budgetMonth.id);
      state.budgetItems = groupBudgetItems(budgetItems);
      state.selectedMonth = DateTime.fromISO(result.month_start).toJSDate();
      router.replace({
        name: "budget-month",
        params: { id: result.id },
      });
    }
  } finally {
    state.loading.budgetMonth = false;
  }
}

async function selectMonth(value: Date): Promise<void> {
  try {
    state.loading.budgetMonth = true;
    state.selectedMonth = value;
    const selectedMonth = DateTime.fromJSDate(value).toFormat("yyyy-MM-dd");
    const result = await BudgetMonthApi.getBudgetMonth({ month: selectedMonth });
    if (result) {
      state.budgetMonth = result;
      fetchBudgetItems();
      router.replace({
        name: "budget-month",
        params: { id: result.id },
      });
      return;
    }

    state.budgetMonth = null;
    state.budgetItems = null;
    router.replace({
      name: "budget",
      params: { id: null },
    });
  } finally {
    state.loading.budgetMonth = false;
  }
}

async function fetchBudgetItems(): Promise<void> {
  const budgetItems = await BudgetItemApi.getBudgetItems(state.budgetMonth.id);
  state.budgetItems = groupBudgetItems(budgetItems);
}

function refreshBudgetItems(): void {
  if (state.budgetMonth) {
    fetchBudgetItems();
  }
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
  try {
    state.loading.creatingBudget = true;
    const { error } = await supabase.functions.invoke("create-budget", { body: { month: state.selectedMonth } });
    if (error) {
      console.error("Supabase error creating budget:", error);
      return;
    }

    const month = getMonthString(state.selectedMonth);
    const result = await BudgetMonthApi.getBudgetMonth({ month });

    if (result) {
      state.budgetMonth = result;
      const budgetItems = await BudgetItemApi.getBudgetItems(result.id);
      state.budgetItems = groupBudgetItems(budgetItems);
      router.replace({
        name: "budget-month",
        params: { id: result.id },
      });
    }
  } catch (error) {
    console.error("Catch error creating budget:", error);
  } finally {
    state.loading.creatingBudget = false;
  }
}
</script>
