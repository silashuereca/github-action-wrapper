<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from "./DefaultLayout.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import DashboardLayout from "./DashboardLayout.vue";

export default {
  setup() {
    const route = useRoute();
    const layout = ref(DefaultLayout);

    watch(
      () => route.meta.layout,
      (newLayout) => {
        switch (newLayout) {
          case "dashboard":
            layout.value = DashboardLayout;
            break;
          case "default":
            layout.value = DefaultLayout;
            break;
          default:
            layout.value = DefaultLayout;
        }
      },
      { immediate: true },
    );

    return { layout };
  },
};
</script>
