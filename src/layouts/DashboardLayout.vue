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
              <!-- Current: "bg-gray-800 text-white", Default: "text-gray-400 hover:text-white hover:bg-gray-800" -->
              <router-link to="/" class="group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold" :class="[activeRouteClass('projects-created')]">
                <svg
                  class="size-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span class="sr-only">Dashboard</span>
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
import { useRoute } from "vue-router";

import IconSettings from "../icons/IconSettings.vue";
import { useAppStore } from "../store";
const { state } = useAppStore();
const route = useRoute();
function activeRouteClass(routeName: string): string {
  if (route.name === routeName) {
    return "bg-gray-800 text-white";
  }
  return "text-gray-400 hover:text-white hover:bg-gray-800";
}
</script>

