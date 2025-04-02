import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppStore = defineStore("app", () => {
  type TState = {
    header: string;
  };

  const state: TState = reactive({
    header: "",
  });

  function setHeader(header: string) {
    state.header = header;
  }

  return { setHeader, state };
});
