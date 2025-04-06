import { supabase } from "../../../supabase";
import { TWorkflow } from "./types";
export class WorkflowsApi {
  async getWorkflows(): Promise<TWorkflow[]> {
    const { data, error } = await supabase.from("workflows").select("*").order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data;
  }
}
