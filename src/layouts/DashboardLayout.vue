<template>
  <div>
    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
      <div class="flex h-16 shrink-0 items-center justify-center">
        <img class="h-12 w-auto" src="../assets/images/pilot_white_transparent.png" alt="Action Pilot Logo">
      </div>
      <nav class="mt-8">
        <ul role="list" class="flex flex-col items-center space-y-1">
          <li>
            <!-- Current: "bg-gray-800 text-white", Default: "text-gray-400 hover:text-white hover:bg-gray-800" -->
            <router-link to="/" class="group flex gap-x-3 rounded-md bg-gray-800 p-3 text-sm/6 font-semibold text-white">
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
    <main class="lg:pl-20">
      <div :class="{'lg:pl-72': route.name === 'project-workflows', 'xl:pl-5': route.name !== 'project-workflows'}">
        <div class="px-4 sm:px-6 lg:px-8 py-6">
          <h3 class="font-bold text-xl" v-text="state.header" />
          <slot />
        </div>
      </div>
    </main>

    <aside v-if="route.name === 'project-workflows'" class="fixed inset-y-0 left-20 hidden w-72 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
      <ul role="list" class="-mx-2 space-y-1">
        <li>
          <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
          <router-link :to="{ name: 'project-workflows', params: { id: projectId }}" class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-600" :class="[activeRouteClass('project-workflows')]">
            <IconSquareStack class="size-6" />
            Workflows
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import IconSquareStack from "../icons/IconSquareStack.vue";
import { useAppStore } from "../store";
const { state } = useAppStore();
const route = useRoute();
const projectId = route.params.id as string | undefined;

function activeRouteClass(routeName: string): string {
  if (route.name === routeName) {
    return "bg-gray-50";
  }
  return "hover:bg-gray-50";
}
</script>

