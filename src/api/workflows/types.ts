export type TWorkflow = {
  created_at: string;
  id: string;
  name: string;
  project_id: string;
  repository_id: string;
  workflow_data: any;
};

export type TTriggerType = "push" | "pull_request" | "workflow_dispatch" | "schedule";
export type TWorkflowStepType = "run" | "uses";

export type TWorkflowData = {
  jobs: TWorkflowJob[];
  name: string;
  triggers: {
    branches?: string[];
    type: TTriggerType;
  };
};

export type TWorkflowJob = {
  env?: Record<string, string>; // Optional environment variables for the job
  name: string;
  runsOn: "ubuntu-latest" | "windows-latest" | "macos-latest"; // GitHub hosted runners
  steps: TWorkflowStep[]; // Array of steps to execute in this job
};

export type TWorkflowRunStep = {
  name: string;
  run: string;
  type: "run";
};

export type TWorkflowUsesStep = {
  name: string;
  type: "uses";
  uses: string;
  with?: Record<string, any>;
};

export type TWorkflowStep = TWorkflowRunStep | TWorkflowUsesStep;
