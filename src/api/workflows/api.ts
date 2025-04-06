import { supabase } from "../../../supabase";
import { TWorkflow, TWorkflowData } from "./types";
export class WorkflowsApi {
  static async getWorkflows(projectId: string): Promise<TWorkflow[]> {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", projectId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data;
  }

  static async createWorkflow(variables: { projectId: string; workflowData: TWorkflowData }): Promise<void> {
    const { projectId, workflowData } = variables;
    const { error } = await supabase.from("workflows").insert([
      {
        name: workflowData.name,
        project_id: projectId,
        workflow_data: workflowData,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateWorkflow(variables: { workflowData: TWorkflowData; workflowId: string }): Promise<void> {
    const { workflowData, workflowId } = variables;

    const { error } = await supabase
      .from("workflows")
      .update({
        name: workflowData.name,
        workflow_data: workflowData,
      })
      .eq("id", workflowId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async getWorkflowById(workflowId: string): Promise<TWorkflow> {
    const { data, error } = await supabase.from("workflows").select("*").eq("id", workflowId).single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Workflow not found");
    }

    return data;
  }
}
