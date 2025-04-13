<template>
  <div>
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <DatePicker
          :model-value="state.selectedMonth"
          view="month"
          date-format="MM"
          @update:model-value="selectMonth"
        />
      </div>
    
      <div class="flex justify-end">
        <Button label="Create Budget" type="button" severity="contrast" @click="createBudget()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button, DatePicker } from "primevue";
import { onMounted, reactive } from "vue";

import { supabase } from "../../../../supabase";

type TState = {
  selectedMonth: Date;
};

const state: TState = reactive({
  selectedMonth: null,
});

onMounted(() => {
  setDefaultDate();
});

function setDefaultDate(): void {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  state.selectedMonth = firstOfMonth;
}

function selectMonth(value: Date): void {
  console.log("Month", value);
}

async function createBudget(): Promise<void> {
  const { data, error } = await supabase.functions.invoke("create-budget");
  console.log("Data", data);
  console.log("Error", error);
}
</script>
