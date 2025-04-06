import { createRouter, createWebHistory } from "vue-router";

import { supabase } from "../../supabase";

const routes = [
  {
    component: () => import("../pages/dashboard/ProjectView.vue"),
    meta: { layout: "dashboard" },
    name: "project-workflows",
    path: "/project/:id/workflows",
  },
  {
    component: () => import("../pages/dashboard/ProjectsCreated.vue"),
    meta: { layout: "dashboard" },
    name: "projects-created",
    path: "/",
  },
  {
    component: () => import("../pages/dashboard/UserSettings.vue"),
    meta: { layout: "dashboard" },
    name: "user-settings",
    path: "/settings",
  },
  {
    component: () => import("../pages/SignUp.vue"),
    meta: { layout: "default" },
    name: "sign-up", // Named route for easier navigation
    path: "/sign-up",
  },
  {
    component: () => import("../pages/SignIn.vue"),
    meta: { layout: "default" },
    name: "sign-in", // Named route for easier navigation
    path: "/sign-in",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = Boolean(session);
  const isPublicRoute = to.matched.some((record) => record.meta.layout === "default");
  const isSignInRoute = to.path === "/sign-in";
  const isSignUpRoute = to.path === "/sign-up";
  const isSignInOrSignUpRoute = isSignInRoute || isSignUpRoute;
  if (isAuthenticated && isSignInOrSignUpRoute) {
    next({ path: "/" });
  } else if (!isAuthenticated && !isPublicRoute) {
    next({ path: "/sign-in" });
  } else {
    next();
  }
});

export default router;
