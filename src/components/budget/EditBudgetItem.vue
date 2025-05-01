<template>
  <div class="w-full flex justify-between items-center">
    <button v-show="!state.edit" type="button" class="hover:bg-gray-50 cursor-pointer w-full" @click="viewExpenses()">
      <div class="flex items-center justify-between w-full">
        <p class="text-sm" v-text="budgetItem.name" />
        <p class="text-sm" :class="[isOverBudget && 'text-red-500']" v-text="formatCurrency(renderTabViewForAmount)" />
      </div>
      <div class="flex justify-center items-center w-full h-4 rounded-md overflow-visible border border-gray-200" :class="[setProgressColor()]" :style="{ width: setProgressWidth() }">
        <p class="text-xs" v-text="`${getProgressPercentage.toFixed(0)}%`" />
      </div>
    </button>
    <button v-show="!state.edit" type="button" @click="toggle">
      <IconElipsisVertical class="size-6 text-gray-500 ml-4" />
    </button>
 
    <Popover ref="op">
      <div class="flex flex-col">
        <Button
          type="button"
          size="small"
          severity="secondary"
          label="Edit"
          @click="editBudgetItem"
        />
        <Button
          v-show="canDelete"
          class="mt-4"
          type="button"
          size="small"
          severity="danger"
          label="Delete"
          @click="deleteBudgetItem"
        />
      </div>
    </Popover>
    <ConfirmDialog :group="budgetItem.id" class="w-full mx-4 sm:mx-0 sm:w-96" />
    <BudgetItemForm
      v-if="state.edit"
      class="w-full"
      :budget-item-id="budgetItem.id"
      :amount="budgetItem.budgeted_amount"
      :name="budgetItem.name"
      edit
      @update:form="updateList()"
      @update:cancel="cancel()"
    />
  </div>
</template>

<script lang="ts" setup>
import { Button, ConfirmDialog, Popover, useConfirm } from "primevue";
import { computed, PropType, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { TBudgetExpenseRow } from "../../api/budget-expenses/api";
import { TBudgetItem } from "../../api/budget-items/api";
import { BudgetItemApi } from "../../api/budget-items/api";
import { getTotal } from "../../hooks/budget";
import IconElipsisVertical from "../../icons/IconElipsisVertical.vue";
import { formatCurrency } from "../../utils/common";
import BudgetItemForm from "./BudgetItemForm.vue";
import { TTab } from "./types";

const props = defineProps({
  budgetItem: {
    required: true,
    type: Object as PropType<TBudgetItem>,
  },
  canDelete: {
    default: true,
    type: Boolean,
  },
  expenses: {
    default: () => [],
    type: Array as PropType<TBudgetExpenseRow[]>,
  },
  tab: {
    default: "planned",
    type: String as PropType<TTab>,
  },
});

const emit = defineEmits<{
  "update:list";
}>();

type TState = {
  edit: boolean;
  loading: {
    deletingItem: boolean;
  };
};

const router = useRouter();
const op = ref();
const confirm = useConfirm();
const state: TState = reactive({
  edit: false,
  loading: {
    deletingItem: false,
  },
});

const getExpenses = computed(() => {
  const expenses = props.expenses.filter((expense) => expense.budget_item_id === props.budgetItem.id);
  return expenses;
});

const renderTabViewForAmount = computed(() => {
  if (props.tab === "planned") {
    return props.budgetItem.budgeted_amount;
  } else if (props.tab === "spent") {
    return getTotal(getExpenses.value.map((expense) => expense.amount));
  } else if (props.tab === "remaining") {
    return props.budgetItem.budgeted_amount - getTotal(getExpenses.value.map((expense) => expense.amount));
  }
  return 0;
});

const getProgressPercentage = computed(() => {
  if (props.tab === "planned") {
    //render planned percentage
    return getExpensePercentage.value;
  } else if (props.tab === "spent") {
    //render spent percentage
    return getExpensePercentage.value;
  }
  //render remaining percentage
  return getRemainingPercentage();
});

const getExpensePercentage = computed(() => {
  const total = getTotal(getExpenses.value.map((expense) => expense.amount));
  const budgetedAmount = props.budgetItem.budgeted_amount;
  if (total === 0 || budgetedAmount === 0) return 0;
  return (total / budgetedAmount) * 100;
});

const isOverBudget = computed(() => {
  return getExpensePercentage.value > 100;
});

function getRemainingPercentage(): number {
  const total = getTotal(getExpenses.value.map((expense) => expense.amount));
  const budgetedAmount = props.budgetItem.budgeted_amount;
  if (total === 0 || budgetedAmount === 0) return 0;
  return ((budgetedAmount - total) / budgetedAmount) * 100;
}

function setProgressColor(): string {
  if (isOverBudget.value) return "bg-red-600 text-white";
  const percentage = getExpensePercentage.value;
  if (percentage > 0) return "bg-green-500 text-white";
  return "bg-gray-200 text-black";
}

function setProgressWidth(): string {
  const percentage = getProgressPercentage.value;
  const percentageWidth = getProgressPercentage.value + "%";
  if (percentage >= 100 || percentage === 0) return 100 + "%";
  if (percentage === 0) return percentageWidth;

  const minVisibleWidth = 10;
  if (percentage < minVisibleWidth) {
    return minVisibleWidth + "%";
  }
  return percentageWidth;
}

const toggle = (event) => {
  op.value.toggle(event);
};

function editBudgetItem(): void {
  toggle(false);
  state.edit = true;
}

function viewExpenses(): void {
  const budgetItem = props.budgetItem;
  router.push({
    name: "budget-item",
    params: {
      id: budgetItem.budget_month_id,
      itemId: budgetItem.id,
    },
  });
}

function deleteBudgetItem(): void {
  confirm.require({
    accept: async () => {
      try {
        state.loading.deletingItem = true;
        await BudgetItemApi.deleteBudgetItem({ id: props.budgetItem.id });
        emit("update:list");
      } finally {
        state.loading.deletingItem = false;
      }
    },
    acceptProps: {
      label: "Delete",
      loading: state.loading.deletingItem,
      severity: "danger",
      size: "small",
    },
    group: props.budgetItem.id,
    header: "Delete Budget Item",
    message: "Are you sure you want to delete this budget item? This will delete all related transactions.",
    reject: () => {},
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      size: "small",
    },
  });
}

function updateList(): void {
  state.edit = false;
  emit("update:list");
}

function cancel(): void {
  state.edit = false;
}
</script>
