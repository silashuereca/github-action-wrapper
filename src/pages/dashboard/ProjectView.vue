<template>
  <div>
    <div v-show="!state.workflows.length && !state.loading.workflows" class="flex items-center justify-center mt-5">
      <Button label="Create Workflow" type="button" severity="contrast" @click="createWorkflow()" />
    </div>
    <div v-show="state.loading.workflows" class="flex items-center justify-center w-full mt-4">
      <ProgressSpinner
        :style="{ width: '2rem', height: '2rem' }"
        class="p-3"
        stroke-width="4"
      />
    </div>
    <div v-show="state.workflows.length && !state.loading.workflows" class="flex items-center justify-end my-5">
      <Button label="Create Workflow" type="button" severity="contrast" @click="createWorkflow()" />
    </div>
    <DataTable
      v-show="state.workflows.length"
      :value="state.workflows"
      class="w-full"
    >
      <Column field="name" header="Name" />
      <Column field="created_at" header="Created At">
        <template #body="slotProps">
          <div class="flex items-center justify-between">
            <p v-text="slotProps.data.created_at" />
            <Button
              severity="secondary"
              type="button"
              size="small"
              label="Edit"
              @click="editWorkflow(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { WorkflowsApi } from "../../api/workflows/api";
import { TWorkflow } from "../../api/workflows/types";

type TState = {
  loading: {
    workflows: boolean;
  };
  workflows: TWorkflow[];
};

const route = useRoute();
const projectId = route.params.id as string;
const router = useRouter();
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
    state.workflows = await WorkflowsApi.getWorkflows(projectId);
  } finally {
    state.loading.workflows = false;
  }
}

async function createWorkflow(): Promise<void> {
  await router.push({ name: "workflow-create", params: { projectId } });
}

async function editWorkflow(workflowId: number): Promise<void> {
  await router.push({ name: "workflow-edit", params: { id: projectId, workflowId } });
}
</script>

