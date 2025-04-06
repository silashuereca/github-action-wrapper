<template>
  <div>
    <button type="button" @click="logout">
      Logout
    </button>
  </div>
</template>

<script lang="ts" setup>
// import Buffer from "buffer";
import { useRouter } from "vue-router";

import { supabase } from "../../../supabase";
import { useAppStore } from "../../store";
// import { generateYamlFromForm } from "../../utils/build_yaml";

const router = useRouter();
const { setHeader } = useAppStore();
setHeader("Settings");

async function logout() {
  await supabase.auth.signOut();
  router.push("/sign-in");
}

// async function buildWorkflow(): Promise<void> {
//   // Generate the YAML content from the form data
//   const result = await supabase.auth.getSession();
//   const userName = state.authUser.user_name;
//   const filePath = ".github/workflows/test-linting.yml";
//   const requestPath = "/repos/{owner}/{repo}/contents/{path}";
//   const yamlContent = generateYamlFromForm(state.form);
//   // Convert YAML to Base64 (required by GitHub API)
//   const encodedContent = Buffer.Buffer.from(yamlContent).toString("base64");
//   const octokit = new Octokit({
//     auth: result.data.session?.provider_token,
//   });

//   try {
//     let sha: string | undefined = undefined;
//     try {
//       //Check if file exists in the repository
//       const fileContents = await octokit.request(`GET ${requestPath}`, {
//         headers: {
//           accept: "application/vnd.github+json",
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//         owner: userName,
//         path: filePath,
//         repo: state.form.repo,
//       });
//       sha = fileContents?.data.sha;
//     } catch (error) {
//       // If the file doesn't exist, it will throw a 404 error
//       // This is expected if the file hasn't been created yet
//       console.log("File does not exist.");
//     }
//     // need to get the latest commit SHA of the file if it exists
//     const mainBranch = await octokit.request("GET /repos/{owner}/{repo}/git/ref/heads/main", {
//       owner: userName,
//       repo: state.form.repo,
//     });
//     const latestMainSha = mainBranch.data?.object?.sha;

//     if (!latestMainSha) {
//       console.error("Could not find the latest SHA for the main branch.");
//       return;
//     }
//     //probably need to get a list of branches to ensure we are creating a new branch or updating an existing one
//     //create a new branch for the changes
//     const branchName = "feat-testing-workflow-changes";
//     const branchResponse = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
//       headers: {
//         "X-GitHub-Api-Version": "2022-11-28",
//       },
//       owner: userName,
//       ref: `refs/heads/${branchName}`,
//       repo: state.form.repo,
//       sha: latestMainSha, // Now using latest commit from main
//     });

//     console.log("Branch Created:", branchResponse);

//     const variables = {
//       branch: branchName, // Branch where the changes will be pushed
//       committer: {
//         email: state.authUser.email, // Your email associated with the GitHub account
//         name: state.authUser.user_name, // Your GitHub username
//       },
//       content: encodedContent, // Base64 encoded content
//       message: sha ? "Update workflow file" : "Create workflow file", // Commit message
//       owner: userName,
//       path: filePath,
//       repo: state.form.repo,
//       sha,
//     };

//     if (!sha) {
//       // If the file doesn't exist, we don't need to include the sha in the request to update the file
//       delete variables.sha;
//     }

//     const response = await octokit.request(`PUT ${requestPath}`, {
//       headers: {
//         accept: "application/vnd.github+json",
//         "X-GitHub-Api-Version": "2022-11-28",
//       },
//       ...variables,
//     });

//     console.log("Committed File Contents to branch", response);

//     // Need to create a pull request to request merging the changes from the new branch that was created
//     const pullRequestResponse = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
//       base: "main", // Base branch to compare against
//       body: `This pull request updates the workflow file for ${state.form.workflowName}.`, // Description of the pull request
//       head: branchName, // Branch where the changes will be pushed
//       headers: {
//         accept: "application/vnd.github+json",
//         "X-GitHub-Api-Version": "2022-11-28",
//       },
//       owner: userName,
//       repo: state.form.repo,
//       title: state.form.pullRequestName, // Title of the pull request
//     });

//     console.log("Pull Request Created:", pullRequestResponse);

//     // console.log("File exists", response);
//   } catch (error) {
//     console.error("Error creating/updating file:", error.message);
//   }

//   console.log(yamlContent);
// }
</script>
