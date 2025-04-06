<template>
  <div class="w-fill flex justify-center">
    <ProgressSpinner
      v-show="state.loading.workflow"
      :style="{ width: '2rem', height: '2rem' }"
      class="p-3"
      stroke-width="4"
    />
    <div v-show="!state.loading.workflow" class="w-full sm:w-5xl">
      <form @submit.prevent="createOrUpdateWorkflow()">
        <label for="workflow-name" class="text-xs font-bold">Workflow Name</label>
        <InputText v-model="state.form.name" type="text" placeholder="Workflow name" class="w-full" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label for="workflow-trigger" class="text-xs font-bold">Trigger</label>
            <Select
              v-model="state.form.triggers.type"
              :options="triggersOptions"
              option-label="label"
              option-value="value"
              placeholder="Select a trigger"
              class="w-full"
            />
          </div>
          <div>
            <label for="workflow-branches" class="text-xs font-bold">Branches</label>
            <MultiSelect
              v-model="state.form.triggers.branches"
              :options="branchOptions"
              option-label="label"
              option-value="value"
              placeholder="Select a branch"
              class="w-full"
            />
          </div>
        </div>

        <div class="mt-4">
          <div v-for="job, index in state.form.jobs" :key="index">
            <Panel :header="job.name">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label :for="`job-name-${index}`" class="text-xs font-bold">Job Name</label>
                  <InputText v-model="job.name" type="text" placeholder="Job Name" class="w-full" />
                </div>
                <div>
                  <label :for="`runs-on-${index}`" class="text-xs font-bold">Runs On</label>
                  <Select
                    v-model="job.runsOn"
                    :options="runsOnOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select a runner"
                    class="w-full"
                  />
                </div>
              </div>

              <div v-for="step, stepIndex in job.steps" :key="stepIndex" class="mt-10">
                <Panel :header="step.name">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label :for="`step-name-${stepIndex}`" class="text-xs font-bold">Step Name</label>
                      <InputText v-model="step.name" type="text" placeholder="Step Name" class="w-full" />
                    </div>
                    <div>
                      <label :for="`uses-on-${stepIndex}`" class="text-xs font-bold">Type</label>
                      <Select
                        v-model="step.type"
                        :options="runTypeOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select a run type"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label :for="`step-name-${stepIndex}`" class="text-xs font-bold" v-text="step.type === 'run' ? 'Run' : 'Uses'" />
                      <InputText
                        v-if="step.type === 'uses'"
                        v-model="step.uses"
                        type="text"
                        placeholder="Step Name"
                        class="w-full"
                      />
                      <InputText
                        v-if="step.type === 'run'"
                        v-model="step.run"
                        type="text"
                        placeholder="Step Name"
                        class="w-full"
                      />
                    </div>
                  </div>
                </Panel>
              </div>
            </Panel>
          </div>
        </div>
        <div class="flex items-center justify-end mt-10">
          <Button
            v-show="!workflowId"
            :loading="state.loading.creatingOrUpdatingWorkflow"
            label="Create Workflow"
            type="submit"
            severity="contrast"
            class="p-button-raised"
          />
          <Button
            v-show="workflowId"
            :loading="state.loading.creatingOrUpdatingWorkflow"
            label="Update Workflow"
            type="submit"
            severity="contrast"
            class="p-button-raised"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Panel from "primevue/panel";
import ProgressSpinner from "primevue/progressspinner";
import Select from "primevue/select";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { WorkflowsApi } from "../api/workflows/api";
import { TWorkflowData } from "../api/workflows/types";

type TState = {
  form: TWorkflowData;
  loading: {
    creatingOrUpdatingWorkflow: boolean;
    workflow: boolean;
  };
};

const route = useRoute();
const router = useRouter();
const workflowId = route.params.workflowId as string;
const projectId = route.params.id;
const state: TState = reactive({
  form: {
    jobs: [
      {
        name: "build",
        runsOn: "ubuntu-latest",
        steps: [
          {
            name: "Checkout code",
            type: "uses",
            uses: "actions/setup-node@v3",
          },
          {
            name: "Setup Node.js",
            type: "uses",
            uses: "actions/setup-node@v2",
            with: {
              node_version: 22,
            },
          },
          {
            name: "Install Dependencies",
            run: "npm install --frozen-lockfile", // Using npm action to install dependencies
            type: "run",
          },
          {
            name: "Run linter",
            run: "npm run lint",
            type: "run",
          },
        ],
      },
    ],
    name: "Check Linting",
    triggers: {
      branches: ["main"],
      type: "push",
    },
  },
  loading: {
    creatingOrUpdatingWorkflow: false,
    workflow: false,
  },
});

const triggersOptions = [
  { label: "Push", value: "push" },
  { label: "Pull Request", value: "pull_request" },
  { label: "Schedule", value: "schedule" },
];

//TODO: need to pull a list of branches but hard coded for now
const branchOptions = [{ label: "main", value: "main" }];

const runsOnOptions = [
  { label: "ubuntu-latest", value: "ubuntu-latest" },
  { label: "windows-latest", value: "windows-latest" },
  { label: "macos-latest", value: "macos-latest" },
];

const runTypeOptions = [
  { label: "Uses", value: "uses" },
  { label: "Run", value: "run" },
];

onMounted(() => {
  getWorkflow();
});

async function getWorkflow(): Promise<void> {
  if (!workflowId) {
    return;
  }
  state.loading.workflow = true;
  try {
    const workflow = await WorkflowsApi.getWorkflowById(workflowId);
    state.form = workflow.workflow_data;
  } finally {
    state.loading.workflow = false;
  }
}

function createOrUpdateWorkflow(): void {
  if (!workflowId) {
    // Create a new workflow
    createWorkflow();
    return;
  }
  updateWorkflow();
}

async function createWorkflow(): Promise<void> {
  state.loading.creatingOrUpdatingWorkflow = true;
  try {
    await WorkflowsApi.createWorkflow({
      projectId: projectId as string,
      workflowData: state.form,
    });
    await router.push({
      name: "project-workflows",
      params: { id: projectId },
    });
  } finally {
    state.loading.creatingOrUpdatingWorkflow = false;
  }
}

async function updateWorkflow(): Promise<void> {
  state.loading.creatingOrUpdatingWorkflow = true;
  try {
    await WorkflowsApi.updateWorkflow({
      workflowData: state.form,
      workflowId,
    });
    await router.push({
      name: "project-workflows",
      params: { id: projectId },
    });
  } finally {
    state.loading.creatingOrUpdatingWorkflow = false;
  }
}
</script>
