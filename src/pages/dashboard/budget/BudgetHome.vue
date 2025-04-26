<template>
  <div class="w-full flex justify-center">
    <section class="w-full">
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
      <div v-show="state.loading.budgetMonth" class="flex justify-center items-center">
        <ProgressSpinner />
      </div>
      <div v-if="state.budgetItems.length" class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="group in state.budgetItems" :key="group.type" class="w-full">
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
import { Panel, ProgressSpinner } from "primevue";
import { Button, DatePicker } from "primevue";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { supabase } from "../../../../supabase";
import { BudgetItemApi, TBudgetItem } from "../../../api/budget-items/api";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import { BudgetMonthApi, TBudgetMonth } from "../../../api/budget-months/api";
import CreateBudgetItem from "../../../components/budget/CreateBudgetItem.vue";
import EditBudgetItem from "../../../components/budget/EditBudgetItem.vue";

type TBudgetGroup = {
  items: TBudgetItem[];
  type: TBudgetItem["type"];
};

type TState = {
  budgetItems: TBudgetGroup[];
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
  budgetItems: [],
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
  state.loading.budgetMonth = true;
  try {
    const month = getMonthString(state.selectedMonth);
    const result = await BudgetMonthApi.getBudgetMonth({ month, monthId: route.params.id as string });
    if (result) {
      state.budgetMonth = result;
      const items = await BudgetItemApi.getBudgetItems(state.budgetMonth.id);
      state.budgetItems = groupBudgetItems(items);
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
  state.budgetItems = groupBudgetItems(result);
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
      state.budgetItems = groupBudgetItems(items);
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
