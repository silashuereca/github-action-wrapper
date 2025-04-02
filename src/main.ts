import "./style.css";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

createApp(App)
  .use(router)
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      options: {
        darkModeSelector: false,
      },
      preset: Aura,
    },
  })
  .mount("#app");
