<template>
  <div>
    <div v-show="!state.workflows.length && !state.loading.workflows" class="flex items-center justify-center mt-5">
      <Button label="Create Workflow" type="button" severity="contrast" />
    </div>
    <div v-show="state.loading.workflows" class="flex items-center justify-center w-full mt-4">
      <ProgressSpinner
        :style="{ width: '2rem', height: '2rem' }"
        class="p-3"
        stroke-width="4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, reactive } from "vue";

import { WorkflowsApi } from "../../api/workflows/api";
import { TWorkflow } from "../../api/workflows/types";

type TState = {
  loading: {
    workflows: boolean;
  };
  workflows: TWorkflow[];
};

const workflowsApi = new WorkflowsApi();
const state: TState = reactive({
  loading: {
    workflows: false, // Initially set to true to show the spinner
  },
  workflows: [],
});

onMounted(() => {
  fetchWorkflows();
});

async function fetchWorkflows(): Promise<void> {
  state.loading.workflows = true;
  try {
    state.workflows = await workflowsApi.getWorkflows();
  } finally {
    state.loading.workflows = false;
  }
}
</script>

