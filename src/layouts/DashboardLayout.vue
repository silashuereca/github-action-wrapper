<template>
  <div>
    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
      <div class="flex h-16 shrink-0 items-center justify-center">
        <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
      </div>
      <nav class="mt-8">
        <ul role="list" class="flex flex-col items-center space-y-1">
          <li>
            <!-- Current: "bg-gray-800 text-white", Default: "text-gray-400 hover:text-white hover:bg-gray-800" -->
            <a href="#" class="group flex gap-x-3 rounded-md bg-gray-800 p-3 text-sm/6 font-semibold text-white">
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
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <main class="pl-20">
      <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
        <div class="font-bold text-2xl" v-text="state.header" />
        <div class="mt-4">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "../store";
const { state } = useAppStore();
</script>

