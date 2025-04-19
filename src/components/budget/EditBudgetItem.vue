<template>
  <div>
    <button type="button" class="flex justify-between w-full border-b border-blue-300 pb-2 hover:bg-gray-50" @click="editBudgetItem">
      <p class="text-sm" v-text="budgetItem.name" />
      <p class="text-sm" v-text="budgetItem.budgeted_amount" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive } from "vue";

import { TBudgetItem } from "../../api/budget-items/types";
const props = defineProps({
  budgetItem: {
    required: true,
    type: Object as PropType<TBudgetItem>,
  },
});

type TState = {
  amount: number;
  name: string;
};

const state: TState = reactive({
  amount: 0,
  name: "",
});

onMounted(() => {
  state.amount = props.budgetItem.budgeted_amount;
  state.name = props.budgetItem.name;
});

function editBudgetItem(): void {
  //will need to travel to the edit page for this budget item
  console.log("Edit Budget Item", props.budgetItem.id);
}
</script>
