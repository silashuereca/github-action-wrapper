<template>
  <Card class=" max-w-2xl mx-auto">
    <template #header>
      <div class="p-3">
        <button type="button" class="flex items-center cursor-pointer" @click="goBackToBudgetMonth()">
          <IconArrowLeft class="size-3 text-gray-500" />
          <h2 class="font-bold ml-2" v-text="renderTypeHeader(state.budgetItem?.type)" />
        </button>
      </div>
    </template>
    <template #content>
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold ml-2" v-text="state.budgetItem?.name" />
      
        <h2 class="text-2xl font-bold ml-2" v-text="formatCurrency(state.budgetItem?.budgeted_amount)" />
      </div>

      <Button
        class="mt-5"
        type="button"
        label="Add Transaction"
        size="small"
        severity="secondary"
        @click="addTransaction()"
      />

      <Dialog
        v-model:visible="state.addTransaction"
        modal
        header="Add Transaction"
      >
        My Content
      </Dialog>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { Button, Card, Dialog } from "primevue";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { BudgetItemApi, TBudgetItem } from "../../../api/budget-items/api";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import IconArrowLeft from "../../../icons/IconArrowLeft.vue";
import { formatCurrency } from "../../../utils/common";

type TState = {
  addTransaction: boolean;
  budgetItem: TBudgetItem | null;
  loading: {
    budgetItem: boolean;
  };
};

const router = useRouter();
const route = useRoute();
const monthId = route.params.id as string;
const budgetItemId = route.params.itemId as string;

const state: TState = reactive({
  addTransaction: false,
  budgetItem: null,
  loading: {
    budgetItem: false,
  },
});

onMounted(() => {
  state.loading.budgetItem = true;
  getBudgetItem();
});

async function getBudgetItem(): Promise<void> {
  try {
    state.budgetItem = await BudgetItemApi.getBudgetItem({ id: budgetItemId });
  } finally {
    state.loading.budgetItem = false;
  }
}

function goBackToBudgetMonth(): void {
  console.log("Month Id", monthId);
  router.push({
    name: "budget-month",
    params: {
      id: monthId,
    },
  });
}

function addTransaction(): void {
  state.addTransaction = true;
}
</script>
