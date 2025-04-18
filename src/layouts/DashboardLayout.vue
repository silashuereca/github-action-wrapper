<template>
  <!--
  This example requires updating your template:

  ```
  <html class="h-full bg-white">
  <body class="h-full">
  ```
-->
  <div>
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div v-if="openSidebar" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
      <!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    -->
      <div class="fixed inset-0 bg-gray-900/80 transition-opacity ease-linear duration-5000 opacity-0" :class="[openSidebar ? 'opacity-100' : 'opacity-0']" aria-hidden="true" />

      <div class="fixed inset-0 flex">
        <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      -->
        <div class="relative mr-16 flex w-full max-w-xs flex-1 transition ease-in-out duration-3000 transform" :class="[openSidebar ? 'translate-x-0' : '-translate-x-full']">
          <!--
          Close button, show/hide based on off-canvas menu state.

          Entering: "ease-in-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-300"
            From: "opacity-100"
            To: "opacity-0"
        -->
          <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button type="button" class="-m-2.5 p-2.5" @click="openSidebarNav(false)">
              <span class="sr-only">Close sidebar</span>
              <svg
                class="size-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
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
                        Overview
                      </router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'budget'}" class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white" :class="[activeRouteClass('budget-month')]">
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
      </div>
    </div>

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
                    Overview
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'budget'}" class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white" :class="[activeRouteClass('budget-month')]">
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

    <!-- TODO: add support for mobile -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden" @click="openSidebarNav(true)">
        <span class="sr-only">Open sidebar</span>
        <svg
          class="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="flex-1 text-sm/6 font-semibold text-white">
        Overview
      </div>
    </div>
    <div class="flex">
      <div class="lg:pl-72" />
      <main class="py-10 w-full">
        <div class="px-4 sm:px-6 lg:px-8 max-w-6xl w-full m-auto">
          <!-- Your content -->
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import IconCurrencyDollar from "../icons/IconCurrencyDollar.vue";
import IconHome from "../icons/IconHome.vue";
import IconSettings from "../icons/IconSettings.vue";
const route = useRoute();
const router = useRouter();

const openSidebar = ref(false);

onMounted(() => {
  //clean up auth state
  window.history.replaceState({}, document.title, window.location.pathname);

  router.afterEach(() => {
    openSidebar.value = false;
  });
});

function activeRouteClass(routeName: string): string {
  if (route.name === routeName) {
    return "bg-gray-800 text-white";
  }
  return "text-gray-400 hover:text-white hover:bg-gray-800";
}

function openSidebarNav(value: boolean): void {
  openSidebar.value = value;
}
</script>

