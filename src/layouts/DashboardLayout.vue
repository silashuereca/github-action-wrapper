<template>
  <!--
  This example requires updating your template:

  ```
  <html class="h-full bg-white">
  <body class="h-full">
  ```
-->
  <div>
    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <!-- Current: "bg-gray-800 text-white", Default: "text-gray-400 hover:text-white hover:bg-gray-800" -->
                  <router-link :to="{ name: 'home'}" class="group flex gap-x-3 rounded-md  p-2 text-sm/6 font-semibold" :class="[activeRouteClass('home')]">
                    <IconHome class="size-6 shrink-0" />
                    Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'budget'}" class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                    <IconCurrencyDollar class="size-6 shrink-0" />
                    Budget
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <router-link :to="{ name: 'settings'}" class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                <IconSettings class="size-8 rounded-full bg-gray-800" />
                <span class="sr-only">Your Profile</span>
                <span aria-hidden="true">Settings</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8 max-w-6xl">
        <!-- Your content -->
        <router-view />
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

