import "./style.css";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import FocusTrap from "primevue/focustrap";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app
  .use(router)
  .use(ConfirmationService)
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      options: {
        darkModeSelector: false,
      },
      preset: Aura,
    },
  })
  .directive("focustrap", FocusTrap)
  .mount("#app");
