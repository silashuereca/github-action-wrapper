<template>
  <div class="w-full">
    <Button
      v-show="!state.addItem"
      label="Add Item"
      size="small"
      severity="info"
      variant="text"
      @click="toggleAddItemForm"
    />

    <BudgetItemForm
      v-if="state.addItem"
      :month-id="monthId"
      :category="category"
      @update:form="updateList()"
      @update:cancel="cancel()"
    />
  </div>
</template>

<script lang="ts" setup>
import { Button } from "primevue";
import { PropType, reactive } from "vue";

import { TBudgetItemCategory } from "../../api/budget-items/api";
import BudgetItemForm from "./BudgetItemForm.vue";

defineProps({
  category: {
    required: true,
    type: String as PropType<TBudgetItemCategory>,
  },
  monthId: {
    required: true,
    type: String,
  },
});

const emit = defineEmits<{
  "update:list";
}>();

type TState = {
  addItem: boolean;
  form: {
    amount: number;
    name: string;
  };
  loading: {
    creatingBudgetItem: boolean;
  };
};

const state: TState = reactive({
  addItem: false,
  form: {
    amount: 0,
    name: "",
  },
  loading: {
    creatingBudgetItem: false,
  },
});

function toggleAddItemForm(): void {
  state.addItem = !state.addItem;
}

function cancel(): void {
  state.addItem = false;
}

function updateList(): void {
  emit("update:list");
  state.addItem = false;
}
</script>
