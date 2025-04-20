<template>
  <div class="w-full flex justify-between items-center">
    <button v-show="!state.edit" type="button" class="flex justify-between w-full border-b border-blue-300 pb-2 hover:bg-gray-50" @click="viewExpenses()">
      <p class="text-sm" v-text="budgetItem.name" />
      <p class="text-sm" v-text="budgetItem.budgeted_amount" />
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
          class="mt-4"
          type="button"
          size="small"
          severity="danger"
          label="Delete"
          @click="deleteBudgetItem"
        />
      </div>
    </Popover>
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
import { Button, Popover } from "primevue";
import { PropType, reactive, ref } from "vue";

import { TBudgetItem } from "../../api/budget-items/types";
import IconElipsisVertical from "../../icons/IconElipsisVertical.vue";
import BudgetItemForm from "./BudgetItemForm.vue";
const props = defineProps({
  budgetItem: {
    required: true,
    type: Object as PropType<TBudgetItem>,
  },
});

const emit = defineEmits<{
  "update:list";
}>();

type TState = {
  edit: boolean;
};

const op = ref();
const state: TState = reactive({
  edit: false,
});

const toggle = (event) => {
  op.value.toggle(event);
};

function editBudgetItem(): void {
  toggle(false);
  state.edit = true;
  console.log("Edit Budget Item", props.budgetItem.id);
}

function viewExpenses(): void {
  console.log("View Expenses", props.budgetItem.id);
}

function deleteBudgetItem(): void {
  console.log("Delete Budget Item", props.budgetItem.id);
}

function updateList(): void {
  state.edit = false;
  emit("update:list");
}

function cancel(): void {
  state.edit = false;
}
</script>
