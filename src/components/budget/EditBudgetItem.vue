<template>
  <div class="w-full flex justify-between items-center">
    <button v-show="!state.edit" type="button" class="flex justify-between w-full border-b border-blue-300 pb-2 hover:bg-gray-50 cursor-pointer" @click="viewExpenses()">
      <p class="text-sm" v-text="budgetItem.name" />
      <p class="text-sm" v-text="formatCurrency(budgetItem.budgeted_amount)" />
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
import { PropType, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { TBudgetItem } from "../../api/budget-items/api";
import { BudgetItemApi } from "../../api/budget-items/api";
import IconElipsisVertical from "../../icons/IconElipsisVertical.vue";
import { formatCurrency } from "../../utils/common";
import BudgetItemForm from "./BudgetItemForm.vue";
const props = defineProps({
  budgetItem: {
    required: true,
    type: Object as PropType<TBudgetItem>,
  },
  canDelete: {
    default: true,
    type: Boolean,
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
