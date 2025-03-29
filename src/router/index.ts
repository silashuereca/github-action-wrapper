import { createRouter, createWebHistory } from 'vue-router';
import Home from "../components/Home.vue";
import Dashboard from '../components/Dashboard.vue';

const routes = [
  {
    path: '/',
    component: Home,
    meta: { layout: "default" }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { layout: "dashboard" }
  },
  {
    path: "/sign-up",
    component: () => import("../pages/SignUp.vue"),
    meta: { layout: "default" }
  },
  {
    path: "/sign-in",
    component: () => import("../pages/SignIn.vue"),
    meta: { layout: "default" }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;