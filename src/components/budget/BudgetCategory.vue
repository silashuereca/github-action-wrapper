<template>
  <Panel :header="renderTypeHeader(type)">
    <ul>
      <li v-for="budgetItem in budgetItems" :key="budgetItem.id" class="mb-3">
        <EditBudgetItem :budget-item="budgetItem" />
      </li>
      <li class="w-full">
        <CreateBudgetItem :month-id="monthId" :category="type" />
      </li>
    </ul>
  </Panel>
</template>

<script lang="ts" setup>
import { Panel } from "primevue";
import { PropType } from "vue";

import { TBudgetItem } from "../../api/budget-items/types";
import { renderTypeHeader } from "../../api/budget-items/utils";
import CreateBudgetItem from "./CreateBudgetItem.vue";
import EditBudgetItem from "./EditBudgetItem.vue";
defineProps({
  budgetItems: {
    required: true,
    type: Array as PropType<TBudgetItem[]>,
  },
  monthId: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String as PropType<TBudgetItem["type"]>,
  },
});
</script>
