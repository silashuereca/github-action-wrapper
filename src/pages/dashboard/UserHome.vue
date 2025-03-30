<template>
  <div class="p-20">
    <div class="font-bold text-2xl">
      User Dashboard
    </div>

    <pre>{{ state.form }}</pre>

    <Button
      class="mt-5"
      type="button"
      severity="contrast"
      label="Build Workflow"
      @click="buildWorkflow()"
    />

    <div class="mt-10">
      <Button type="button" severity="secondary" label="Sign Out" @click="logout" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Buffer from "buffer";
import { Octokit } from "octokit";
import Button from "primevue/button";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

import { supabase } from "../../../supabase";
import { generateYamlFromForm } from "../../utils/build_yaml";

type TState = {
  authUser: {
    email: string;
    user_name: string;
  };
  form: {
    jobName: string;
    repo: string;
    runner: string;
    steps: any[];
  };
  repos: any[];
};
const router = useRouter();
const state: TState = reactive({
  authUser: {
    email: "",
    user_name: "",
  },
  form: {
    jobName: "Check Linting",
    repo: "github-action-wrapper",
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

onMounted(async () => {
  const session = await supabase.auth.getSession();
  const userMetadata = session.data.session?.user.user_metadata;
  state.authUser.email = userMetadata.email;
  state.authUser.user_name = userMetadata.user_name;
  getUsersRepos();
});

async function logout() {
  await supabase.auth.signOut();
  router.push("/sign-in");
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

  console.log("Repose", repos);
  state.repos = repos;
}

async function buildWorkflow(): Promise<void> {
  // Generate the YAML content from the form data
  const result = await supabase.auth.getSession();
  const userName = state.authUser.user_name;
  const filePath = ".github/workflows/test-linting.yml";
  const requestPath = "/repos/{owner}/{repo}/contents/{path}";
  const yamlContent = generateYamlFromForm(state.form);
  // Convert YAML to Base64 (required by GitHub API)
  const encodedContent = Buffer.Buffer.from(yamlContent).toString("base64");
  const octokit = new Octokit({
    auth: result.data.session?.provider_token,
  });

  try {
    let sha: string | undefined = undefined;
    try {
      //Check if file exists in the repository
      const fileContents = await octokit.request(`GET ${requestPath}`, {
        headers: {
          accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        owner: userName,
        path: filePath,
        repo: state.form.repo,
      });
      sha = fileContents?.data.sha;
    } catch (error) {
      // If the file doesn't exist, it will throw a 404 error
      // This is expected if the file hasn't been created yet
      console.log("File does not exist.");
    }

    const variables = {
      committer: {
        email: state.authUser.email, // Your email associated with the GitHub account
        name: state.authUser.user_name, // Your GitHub username
      },
      content: encodedContent, // Base64 encoded content
      message: sha ? "Update workflow file" : "Create workflow file", // Commit message
      owner: userName,
      path: filePath,
      repo: state.form.repo,
      sha,
    };

    if (!sha) {
      // If the file doesn't exist, we don't need to include the sha in the request to update the file
      delete variables.sha;
    }

    const response = await octokit.request(`PUT ${requestPath}`, {
      headers: {
        accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      ...variables,
    });

    console.log("File exists", response);
  } catch (error) {
    console.error("Error creating/updating file:", error.message);
  }

  console.log(yamlContent);
}
</script>
