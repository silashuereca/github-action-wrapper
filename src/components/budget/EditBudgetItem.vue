<template>
  <div class="w-full flex justify-between items-center">
    <button type="button" class="flex justify-between w-full border-b border-blue-300 pb-2 hover:bg-gray-50" @click="editBudgetItem">
      <p class="text-sm" v-text="budgetItem.name" />
      <p class="text-sm" v-text="budgetItem.budgeted_amount" />
    </button>
    <button type="button" @click="toggle">
      <IconElipsisVertical class="size-6 text-gray-500 ml-4" />
    </button>
 
    <Popover ref="op">
      Content Here
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import { Popover } from "primevue";
import { onMounted, PropType, reactive, ref } from "vue";

import { TBudgetItem } from "../../api/budget-items/types";
import IconElipsisVertical from "../../icons/IconElipsisVertical.vue";
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

const op = ref();
const state: TState = reactive({
  amount: 0,
  name: "",
});

onMounted(() => {
  state.amount = props.budgetItem.budgeted_amount;
  state.name = props.budgetItem.name;
});

const toggle = (event) => {
  op.value.toggle(event);
};

function editBudgetItem(): void {
  //will need to travel to the edit page for this budget item
  console.log("Edit Budget Item", props.budgetItem.id);
}
</script>
