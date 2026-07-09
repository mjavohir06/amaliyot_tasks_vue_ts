<script setup lang="ts">
import { Bell, ChevronDown, Menu, Search, X } from "@lucide/vue";
import { ref } from "vue";

defineProps<{ menuOpen: boolean }>();
const emit = defineEmits<{ toggleMenu: [] }>();

const profileOpen = ref(false);
const searchOpen = ref(false);
const notificationsOpen = ref(false);
const query = ref("");
</script>

<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-5">
    <div class="flex min-w-0 items-center gap-3">
      <button
        type="button"
        aria-label="Toggle menu"
        :aria-expanded="menuOpen"
        class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        @click="emit('toggleMenu')"
      >
        <Menu :size="20" />
      </button>
      <div class="min-w-0">
        <h1 class="truncate text-sm font-semibold text-gray-900 sm:text-base">Task board</h1>
        <p class="hidden text-xs text-gray-500 sm:block">Project work and follow-ups</p>
      </div>
    </div>

    <div class="flex items-center gap-1.5 sm:gap-3">
      <div class="relative hidden sm:block">
        <button
          type="button"
          aria-label="Search"
          class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          @click="searchOpen = !searchOpen; notificationsOpen = false; profileOpen = false"
        >
          <Search :size="18" />
        </button>
        <div v-if="searchOpen" class="absolute right-0 top-full z-30 mt-2 w-72 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div class="relative">
            <Search :size="15" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="query" autofocus placeholder="Search tasks" class="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-[13px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400" />
          </div>
          <p class="mt-2 text-[12px] text-gray-500">{{ query ? `Looking for ${query}` : 'Type a task name or note' }}</p>
        </div>
      </div>

      <div class="relative">
        <button
          type="button"
          aria-label="Notifications"
          class="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          @click="notificationsOpen = !notificationsOpen; searchOpen = false; profileOpen = false"
        >
          <Bell :size="18" />
          <span class="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <div v-if="notificationsOpen" class="absolute right-0 top-full z-30 mt-2 w-64 rounded-md border border-gray-200 bg-white p-2 shadow-sm">
          <p class="px-2 py-1 text-[12px] font-medium text-gray-500">Notifications</p>
          <button type="button" class="block w-full rounded-md px-2 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50">Logo task is due this week.</button>
          <button type="button" class="block w-full rounded-md px-2 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50">Two cards have new comments.</button>
        </div>
      </div>

      <div class="hidden h-7 w-px bg-gray-200 sm:block" />

      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-2 rounded-md py-1.5 pl-1 pr-2 hover:bg-gray-100"
          @click="profileOpen = !profileOpen; searchOpen = false; notificationsOpen = false"
        >
          <span class="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            <img src="/assets/image1.png" alt="Aziz" class="h-full w-full object-cover" />
          </span>
          <span class="text-sm font-medium text-gray-700 max-sm:hidden">Aziz</span>
          <ChevronDown :size="15" class="text-gray-400" />
        </button>
        <div v-if="profileOpen" class="absolute right-0 top-full z-30 mt-2 w-44 rounded-md border border-gray-200 bg-white p-1.5 shadow-sm">
          <button class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50" @click="profileOpen = false">Profile</button>
          <button class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50" @click="profileOpen = false">Settings</button>
          <button class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50" @click="profileOpen = false">
            Log out
            <X :size="14" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>