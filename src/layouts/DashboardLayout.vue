<template>
  <div>
    <!-- Static sidebar for desktop -->
    <div class="fixed flex flex-col inset-y-0 left-0 z-50 w-20 overflow-y-auto bg-gray-900 pb-4">
      <div class="h-full">
        <div class="flex h-16 shrink-0 items-center justify-center">
          <img class="h-12 w-auto" src="../assets/images/pilot_white_transparent.png" alt="Action Pilot Logo">
        </div>
        <nav class="mt-8">
          <ul role="list" class="flex flex-col items-center space-y-1">
            <li>
              <!-- Home View: will see stats here -->
              <router-link :to="{ name: 'home'}" class="group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold" :class="[activeRouteClass('home')]">
                <IconHome class="size-6 shrink-0" />
                <span class="sr-only">Home</span>
              </router-link>
            </li>
            <li>
              <!-- Budgeting application -->
              <router-link :to="{ name: 'budget'}" class="group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold" :class="[activeRouteClass('budget')]">
                <IconCurrencyDollar class="size-6 shrink-0" />
                <span class="sr-only">Budget</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="p-3 flex items-center justify-center">
        <router-link :to="{ name: 'user-settings'}" class="group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold" :class="[activeRouteClass('user-settings')]">
          <IconSettings class="size-6 text-white" />
        </router-link>
      </div>
    </div>
    <main class="lg:pl-20">
      <div class="xl:pl-5">
        <div class="px-4 sm:px-6 lg:px-8 py-6">
          <h3 v-show="route.path === '/'" class="font-bold text-xl" v-text="state.header" />
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import IconCurrencyDollar from "../icons/IconCurrencyDollar.vue";
import IconHome from "../icons/IconHome.vue";
import IconSettings from "../icons/IconSettings.vue";
import { useAppStore } from "../store";
const { state } = useAppStore();
const route = useRoute();

onMounted(() => {
  //clean up auth state
  window.history.replaceState({}, document.title, window.location.pathname);
});

function activeRouteClass(routeName: string): string {
  if (route.name === routeName) {
    return "bg-gray-800 text-white";
  }
  return "text-gray-400 hover:text-white hover:bg-gray-800";
}
</script>

