import { supabase } from "../../../supabase";
import { TProject } from "./types";
export class ProjectApi {
  async getAll(): Promise<TProject[]> {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async create(variables: { repoId: number }): Promise<{ success: boolean }> {
    const { repoId } = variables;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("projects").insert([
      {
        repository_id: repoId,
        user_id: user.id,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}
