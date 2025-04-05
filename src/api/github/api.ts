import { Octokit } from "octokit";

import { supabase } from "../../../supabase";
import { TRepository } from "./types";

export class GithubApi {
  static providerToken: string | null = null;

  static async init() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      this.providerToken = session.provider_token;
    } else {
      console.error("No session found, unable to set provider token.");
    }
  }

  static async getRepositories(): Promise<TRepository[]> {
    const octokit = new Octokit({
      auth: this.providerToken,
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

    return response.data.filter((repo) => !repo.fork && !repo.archived);
  }
}
