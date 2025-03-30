<template>
  <div>
    <div>User Dashboard</div>

    <div>
      User Dashboard
      <button type="button" @click="logout">
        Logout
      </button>
    </div>

    <div>
      <button type="button" @click="logout">
        Logout
      </button>
      <button type="button" @click="checkAuthSession">
        Check Auth Session
      </button>
    </div>

    <div class="w-96">
      <label for="location" class="block text-sm/6 font-medium text-gray-900">Repositories</label>
      <div class="mt-2 grid grid-cols-1">
        <select
          id="location"
          v-model="state.form.repo"
          name="location"
          class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          <option v-for="repo in state.repos" :key="repo.id" :value="repo.id" v-text="repo.name" />
        </select>
        <svg
          class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fill-rule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <button class="mt-5" type="button" @click="buildWorkflow()">
      Build Workflow
    </button>

    <pre>{{ state.form }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { Octokit } from "octokit";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

import { supabase } from "../../../supabase";
import { generateYamlFromForm } from "../../utils/build_yaml";

type TState = {
  form: {
    jobName: string;
    repo: number | null;
    runner: string;
    steps: any[];
  };
  repos: any[];
};
const router = useRouter();
const state: TState = reactive({
  form: {
    jobName: "Run Linter",
    repo: 956828879, // action wrapper repo ID
    runner: "node", // Default runner
    steps: [
      {
        name: "Checkout code",
        uses: "actions/checkout@v2",
      },
      {
        name: "Setup Node.js",
        uses: "actions/setup-node@v2",
        with: {
          node_version: 22, // Default Node.js version
        },
      },
      {
        name: "Install dependencies",
        run: "npm install",
      },
      {
        name: "Run linter",
        run: "npm run lint", // Assuming you have a lint script in your package.json
      },
    ],
    trigger: "push", // Default trigger
    workflowName: "Check Linting",
  },
  repos: [],
});

onMounted(() => {
  getUsersRepos();
});

async function logout() {
  await supabase.auth.signOut();
  router.push("/sign-in");
}

async function checkAuthSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    console.log("Current session:", session);
  } else {
    console.log("No active session found.");
  }
}

async function getUsersRepos(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const octokit = new Octokit({
    auth: data.session?.provider_token,
  });
  const response = await octokit.request("GET /user/repos?affiliation=owner", {
    headers: {
      accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch user repos:", response.statusText);
    return;
  }

  const repos = response.data.filter((repo) => !repo.fork && !repo.archived);
  state.repos = repos;
}

function buildWorkflow(): void {
  // Generate the YAML content from the form data
  const yamlContent = generateYamlFromForm(state.form);

  // Here you can do something with the generated YAML, like saving it to a file,
  // sending it to an API, or displaying it in the console.
  console.log(yamlContent);
}
</script>
