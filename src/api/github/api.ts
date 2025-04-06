import { Octokit } from "octokit";

import { supabase } from "../../../supabase";
import { TRepository } from "./types";

export class GithubApi {
  static providerToken: string | null = null;

  protected static async redirectIfUnauthenticated(status: number): Promise<void> {
    if (status === 401) {
      await supabase.auth.signOut();
    }
  }

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

    let repos: TRepository[] = [];
    try {
      const response = await octokit.request("GET /user/repos?affiliation=owner", {
        headers: {
          accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      repos = response.data.filter((repo) => !repo.fork && !repo.archived);
    } catch (error) {
      await this.redirectIfUnauthenticated(error.status);
    }

    return repos;
  }
}
