<template>
  <div>
    <DataTable v-show="state.projects.length" :value="state.projects" class="w-full">
      <Column field="name" header="Name" />
      <Column field="description" header="Description" />
      <Column field="created_at" header="Created At">
        <template #body="slotProps">
          <div class="flex items-center justify-between">
            <p v-text="slotProps.data.created_at" />
            <Button
              severity="secondary"
              type="button"
              size="small"
              label="View"
              @click="viewProject(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <div v-show="state.loading.projects" class="flex items-center justify-center w-full mt-4">
      <ProgressSpinner
        :style="{ width: '2rem', height: '2rem' }"
        class="p-3"
        stroke-width="4"
      />
    </div>

    <div v-show="!state.projects.length && !state.loading.projects" class="text-center mt-4">
      <div>
        <p class="text-sm text-gray-400">
          You can create a new project to get started.
        </p>

        <Button
          type="button"
          label="Create Project"
          severity="contrast"
          size="small"
          class="mt-5"
          @click="showModal()"
        />
      </div>
    </div>

    <Modal v-model:visible="state.showModal" modal header="Create Project" :style="{ width: '40rem' }">
      <div class="mt-2">
        <FloatLabel variant="on">
          <InputText id="name" v-model="state.form.name" type="text" class="w-full" />
          <label for="name">Name</label>
        </FloatLabel>
      </div>
      <div class="mt-5">
        <FloatLabel variant="on">
          <Textarea id="description" v-model="state.form.description" type="text" class="w-full" />
          <label for="description">Description</label>
        </FloatLabel>
      </div>

      <div class="mt-10 flex justify-end">
        <Button
          type="button"
          label="Create"
          severity="contrast"
          :loading="state.loading.creatingProject"
          @click="createProject()"
        />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Modal from "primevue/dialog";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import Textarea from "primevue/textarea";
import { onMounted, reactive } from "vue";
import { Router, useRouter } from "vue-router";

import { ProjectApi } from "../../api/projects/api";
import { TProject } from "../../api/projects/types";
import { useAppStore } from "../../store";

type TState = {
  form: {
    description: string;
    name: string;
  };
  loading: {
    creatingProject: boolean;
    projects: boolean;
  };
  projects: TProject[];
  showModal: boolean;
};

const router: Router = useRouter();
const projectApi: ProjectApi = new ProjectApi();
const { setHeader } = useAppStore();
setHeader("Projects");

const state: TState = reactive({
  form: {
    description: "",
    name: "",
  },
  loading: {
    creatingProject: false,
    projects: false,
  },
  projects: [],
  showModal: false,
});

onMounted(() => {
  state.loading.projects = true;
  fetchProjects();
});

async function fetchProjects(): Promise<void> {
  try {
    const projects = await projectApi.getAll();
    state.projects = projects;
  } finally {
    state.loading.projects = false;
  }
}

function showModal(): void {
  state.showModal = true;
}

async function createProject(): Promise<void> {
  state.loading.creatingProject = true;
  try {
    await projectApi.create({
      description: state.form.description,
      name: state.form.name,
    });
    await fetchProjects();
  } finally {
    state.loading.creatingProject = false;
    state.showModal = false;
  }
}

function viewProject(projectId: string): void {
  router.push({ name: "project-edit", params: { id: projectId } });
}
</script>
