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

  async create(variables: { description: string; name: string }): Promise<{ success: boolean }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("projects").insert([
      {
        description: variables.description,
        name: variables.name,
        user_id: user.id,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}
