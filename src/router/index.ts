import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    component: () => import("../pages/SignUp.vue"),
    meta: { layout: "default" },
    path: "/sign-up",
  },
  {
    component: () => import("../pages/SignIn.vue"),
    meta: { layout: "default" },
    path: "/sign-in",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
