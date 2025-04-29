<template>
  <div class="w-full flex justify-center">
    <div v-show="state.loading.budgetMonth" class="flex justify-center items-center">
      <ProgressSpinner />
    </div>
    <section v-show="!state.loading.budgetMonth" class="w-full">
      <div class="flex justify-center items-center w-full">
        <div class="sm:w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <DatePicker
              :model-value="state.selectedMonth"
              view="month"
              date-format="MM-yy"
              @update:model-value="selectMonth"
            />
          </div>
    
          <div v-show="!state.loading.budgetMonth && !state.budgetMonth" class="mt-20 sm:flex sm:mt-0 sm:justify-end m-auto sm:m-0">
            <Button
              label="Create Budget"
              type="button"
              severity="contrast"
              :loading="state.loading.creatingBudget"
              @click="createBudget()"
            />
          </div>
        </div>
      </div>

      <div v-show="state.budgetItems.length" class="w-full mb-2">
        <Tabs v-model:value="state.tab">
          <TabList>
            <Tab value="planned">
              Planned
            </Tab>
            <Tab value="spent">
              Spent
            </Tab>
          </TabList>
        </Tabs>

        <!-- Planned -->
        <dl v-show="state.tab === 'planned'" class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6">
            <dt class="truncate text-sm font-medium text-gray-500">
              Income
            </dt>
            <dd class="mt-1 text-2xl font-semibold tracking-tight text-green-600" v-text="formatCurrency(totalIncome)" />
          </div>
          <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6">
            <dt class="truncate text-sm font-medium text-gray-500">
              Planned Budget
            </dt>
            <dd class="mt-1 text-2xl font-semibold tracking-tight text-slate-600" v-text="formatCurrency(monthlyBudgetTotal)" />
          </div>
          <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6">
            <dt class="truncate text-sm font-medium text-gray-500" title="Left Over Money To Budget">
              Left Over Money To Budget
            </dt>
            <dd class="mt-1 text-2xl font-semibold tracking-tight text-gray-800" :class="[isNegativeBudget ? 'text-red-700' : 'text-gray-800']" v-text="formatCurrency(leftToBudget)" />
          </div>
        </dl>

        <!-- Spent -->
        <dl v-show="state.tab === 'spent'" class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6">
            <dt class="truncate text-sm font-medium" :class="[overSpentOnTotalIncome ? 'text-red-700' : 'text-gray-500']">
              Spent So Far
            </dt>
            <dd class="mt-1 text-2xl font-semibold tracking-tight" :class="[overSpentOnTotalIncome ? 'text-red-700' : 'text-green-600']" v-text="formatCurrency(totalExpenses)" />
          </div>
          <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6">
            <dt class="truncate text-sm font-medium text-gray-500">
              Income Left To Spend
            </dt>
            <dd class="mt-1 text-2xl font-semibold tracking-tight text-slate-800" v-text="formatCurrency(remainingToSpendTotal)" />
          </div>
          <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6">
            <dt class="truncate text-sm font-medium" :class="[percentageIsOverBudget ? 'text-red-700' : 'text-gray-800']">
              % of Budget Spent
            </dt>
            <dd class="mt-1 text-2xl font-semibold tracking-tight text-gray-800" :class="[percentageIsOverBudget ? 'text-red-700' : 'text-gray-800']" v-text="`${percentageOfBudgetSpent.toFixed(0)}%`" />
          </div>
        </dl>
      </div>
      <div v-if="state.budgetItems.length" class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="group in state.budgetItemGroups" :key="group.type" class="w-full">
          <Panel :header="renderTypeHeader(group.type)">
            <ul>
              <li v-for="budgetItem in group.items" :key="budgetItem.id" class="mb-3">
                <EditBudgetItem :budget-item="budgetItem" :can-delete="group.items.length > 1" @update:list="refreshBudgetItems()" />
              </li>
              <li class="w-full">
                <CreateBudgetItem :month-id="state.budgetMonth.id" :category="group.type" @update:list="refreshBudgetItems()" />
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from "luxon";
import { Panel, ProgressSpinner, Tab, TabList, Tabs } from "primevue";
import { Button, DatePicker } from "primevue";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { supabase } from "../../../../supabase";
import { BudgetExpenseApi, TBudgetExpenseRow } from "../../../api/budget-expenses/api";
import { BudgetItemApi, TBudgetItem } from "../../../api/budget-items/api";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import { BudgetMonthApi, TBudgetMonth } from "../../../api/budget-months/api";
import CreateBudgetItem from "../../../components/budget/CreateBudgetItem.vue";
import EditBudgetItem from "../../../components/budget/EditBudgetItem.vue";
import { useBudget } from "../../../hooks/budget";
import { formatCurrency } from "../../../utils/common";

export type TBudgetGroup = {
  items: TBudgetItem[];
  type: TBudgetItem["type"];
};

type TState = {
  budgetExpenses: TBudgetExpenseRow[];
  budgetItemGroups: TBudgetGroup[];
  budgetItems: TBudgetItem[];
  budgetMonth: TBudgetMonth | null;
  loading: {
    budgetMonth: boolean;
    creatingBudget: boolean;
  };
  selectedMonth: Date;
  tab: "planned" | "spent";
};

const route = useRoute();
const router = useRouter();
const state: TState = reactive({
  budgetExpenses: [],
  budgetItemGroups: [],
  budgetItems: [],
  budgetMonth: null,
  loading: {
    budgetMonth: true,
    creatingBudget: false,
  },
  selectedMonth: null,
  tab: "planned",
});

const {
  isNegativeBudget,
  leftToBudget,
  monthlyBudgetTotal,
  overSpentOnTotalIncome,
  percentageIsOverBudget,
  percentageOfBudgetSpent,
  remainingToSpendTotal,
  totalExpenses,
  totalIncome,
} = useBudget(state);

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
  state.loading.budgetMonth = true;
  try {
    const month = getMonthString(state.selectedMonth);
    const result = await BudgetMonthApi.getBudgetMonth({ month, monthId: route.params.id as string });
    if (result) {
      state.budgetMonth = result;
      const items = await BudgetItemApi.getBudgetItems(state.budgetMonth.id);
      const expense = await BudgetExpenseApi.getAllMonthlyExpenses({ budgetMonthId: result.id });
      state.budgetItems = items;
      state.budgetExpenses = expense;
      state.budgetItemGroups = groupBudgetItems(items);
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
    state.budgetItems = [];
    router.replace({
      name: "budget",
      params: { id: null },
    });
  } finally {
    state.loading.budgetMonth = false;
  }
}

function groupBudgetItems(items: TBudgetItem[]): { items: TBudgetItem[]; type: TBudgetItem["type"] }[] {
  const typeOrder: TBudgetItem["type"][] = [
    "income",
    "savings",
    "housing",
    "transportation",
    "food",
    "personal",
    "lifestyle",
    "health",
    "insurance",
    "debt",
  ];

  const groupMap = new Map<TBudgetItem["type"], TBudgetItem[]>();

  items.forEach((item) => {
    if (!groupMap.has(item.type)) {
      groupMap.set(item.type, []);
    }
    groupMap.get(item.type)!.push(item);
  });

  const groups = typeOrder
    .filter((type) => groupMap.has(type))
    .map((type) => ({
      items: groupMap.get(type)!,
      type,
    }));

  return groups;
}

async function fetchBudgetItems(): Promise<void> {
  const result = await BudgetItemApi.getBudgetItems(state.budgetMonth.id);
  const expense = await BudgetExpenseApi.getAllMonthlyExpenses({ budgetMonthId: state.budgetMonth.id });
  state.budgetExpenses = expense;
  state.budgetItems = result;
  state.budgetItemGroups = groupBudgetItems(result);
}

function refreshBudgetItems(): void {
  if (state.budgetMonth) {
    fetchBudgetItems();
  }
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
      const items = await BudgetItemApi.getBudgetItems(result.id);
      state.budgetItems = items;
      state.budgetItemGroups = groupBudgetItems(items);
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
