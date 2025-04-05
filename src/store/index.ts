import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppStore = defineStore("app", () => {
  type TState = {
    header: string;
    projectSet: boolean;
  };

  const state: TState = reactive({
    header: "",
    projectSet: false,
  });

  function setHeader(header: string, options?: { projectSet: boolean }) {
    state.header = header;
    if (options?.projectSet) {
      state.projectSet = true;
    }
  }

  return { setHeader, state };
});
