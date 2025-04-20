import "./style.css";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import FocusTrap from "primevue/focustrap";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.directive("focustrap", FocusTrap);
app
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
