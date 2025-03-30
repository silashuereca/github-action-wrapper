import { stringify } from "yaml";

export function generateYamlFromForm(form) {
  const yamlObject = {
    jobs: {
      [form.jobName.replace(/\s+/g, "-").toLowerCase()]: {
        "runs-on": "ubuntu-latest",
        steps: form.steps.map((step) => {
          let stepObj: any = { name: step.name };

          if (step.uses) {
            stepObj.uses = step.uses;
            if (step.with) {
              stepObj.with = step.with;
            }
          } else if (step.run) {
            stepObj.run = step.run;
          }

          return stepObj;
        }),
      },
    },
    name: form.workflowName,
    on: form.trigger,
  };

  return stringify(yamlObject);
}
