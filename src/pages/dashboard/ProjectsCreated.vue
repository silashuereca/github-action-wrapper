<template>
  <div>
    <DataTable
      v-show="state.repositories.length"
      v-model:filters="state.filters"
      :value="state.repositories"
      filter-display="row"
      :global-filter-fields="['full_name']"
      class="w-full"
    >
      <Column field="full_name" header="Name">
        <template #body="slotProps">
          <a
            :href="slotProps.data.svn_url"
            class="text-blue-600 hover:opacity-85"
            target="blank"
            rel="noopener"
            v-text="slotProps.data.full_name"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by name" @input="filterCallback()" />
        </template>
      </Column>
      <Column field="created_at" header="Created At">
        <template #body="slotProps">
          <div class="flex items-center justify-between">
            <p v-text="slotProps.data.created_at" />
            <Button
              v-show="showCreateButton(slotProps.data.id)"
              severity="contrast"
              type="button"
              size="small"
              label="Create"
              :loading="state.loading.repositoryIdBeingCreated === slotProps.data.id"
              @click="createProject(slotProps.data.id)"
            />
            <Button
              v-show="showViewButton(slotProps.data.id)"
              severity="secondary"
              type="button"
              size="small"
              label="View"
              @click="viewProject(slotProps.data)"
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
  </div>
</template>

<script lang="ts" setup>
import { DataTableFilterMeta } from "primevue";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, reactive } from "vue";
import { Router, useRouter } from "vue-router";

import { GithubApi } from "../../api/github/api";
import { TRepository } from "../../api/github/types";
import { ProjectApi } from "../../api/projects/api";
import { TProject } from "../../api/projects/types";
import { useAppStore } from "../../store";

type TState = {
  filters: DataTableFilterMeta; // For DataTable filtering
  form: {
    description: string;
    name: string;
  };
  loading: {
    projects: boolean;
    repositoryIdBeingCreated: number | null;
  };
  projects: TProject[];
  repositories: TRepository[];
};

const router: Router = useRouter();
const projectApi: ProjectApi = new ProjectApi();
const { setHeader } = useAppStore();
setHeader("Projects");

const state: TState = reactive({
  filters: {
    full_name: { matchMode: "contains", value: null },
  },
  form: {
    description: "",
    name: "",
  },
  loading: {
    projects: false,
    repositoryIdBeingCreated: null,
  },
  projects: [],
  repositories: [],
});

onMounted(async () => {
  await GithubApi.init();
  state.loading.projects = true;
  fetchReps();
});

async function fetchReps(): Promise<void> {
  try {
    state.projects = await projectApi.getAll();
    state.repositories = await GithubApi.getRepositories();
  } finally {
    state.loading.projects = false;
  }
}

function showCreateButton(repoId: number): boolean {
  if (!state.projects.length) {
    return true;
  }

  const found = state.projects.some((project) => project.repository_id === repoId);
  return found ? false : true;
}

function showViewButton(repoId: number): boolean {
  return state.projects.some((project) => project.repository_id === repoId);
}

async function createProject(repoId: number): Promise<void> {
  state.loading.repositoryIdBeingCreated = repoId;
  try {
    await projectApi.create({ repoId });
    state.projects = await projectApi.getAll();
  } finally {
    state.loading.repositoryIdBeingCreated = null;
  }
}

async function viewProject(repo: TRepository): Promise<void> {
  const project = state.projects.find((project) => project.repository_id === repo.id);
  await router.push({ name: "project-workflows", params: { id: project.id } });
  setHeader(repo.full_name, { projectSet: true });
}
</script>
