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
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-3 sm:h-16 sm:px-6">
    <button
      type="button"
      aria-label="Toggle menu"
      :aria-expanded="menuOpen"
      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
      @click="emit('toggleMenu')"
    >
      <Menu :size="20" />
    </button>

    <div class="flex items-center gap-2 sm:gap-4">
      <div class="relative hidden sm:block">
        <button
          type="button"
          aria-label="Search"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          @click="searchOpen = !searchOpen; notificationsOpen = false; profileOpen = false"
        >
          <Search :size="19" />
        </button>
        <div v-if="searchOpen" class="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
          <div class="relative">
            <Search :size="15" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="query" autofocus placeholder="Search tasks..." class="w-full rounded-lg bg-gray-50 py-2 pl-9 pr-3 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-emerald-300" />
          </div>
          <p class="mt-2 text-[12px] text-gray-400">{{ query ? `Searching for ${query}` : 'Type to search this board' }}</p>
        </div>
      </div>

      <div class="relative">
        <button
          type="button"
          aria-label="Notifications"
          class="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          @click="notificationsOpen = !notificationsOpen; searchOpen = false; profileOpen = false"
        >
          <Bell :size="19" />
          <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div v-if="notificationsOpen" class="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
          <p class="px-2 py-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Notifications</p>
          <button type="button" class="block w-full rounded-lg px-2 py-2 text-left text-[13px] text-gray-600 hover:bg-gray-50">New task can be added from the board.</button>
          <button type="button" class="block w-full rounded-lg px-2 py-2 text-left text-[13px] text-gray-600 hover:bg-gray-50">Filters are ready to apply.</button>
        </div>
      </div>

      <div class="hidden h-8 w-px bg-gray-100 sm:block" />

      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg py-1.5 pl-1 pr-2 transition-colors hover:bg-gray-50"
          @click="profileOpen = !profileOpen; searchOpen = false; notificationsOpen = false"
        >
          <span class="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            <img src="/assets/image1.png" alt="ArtTemplate" class="h-full w-full object-cover" />
          </span>
          <span class="text-sm font-medium text-gray-700 max-sm:hidden">ArtTemplate</span>
          <ChevronDown :size="15" class="text-gray-400" />
        </button>
        <div v-if="profileOpen" class="absolute right-0 top-full z-30 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
          <button class="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50" @click="profileOpen = false">My profile</button>
          <button class="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50" @click="profileOpen = false">Settings</button>
          <button class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-50" @click="profileOpen = false">
            Log out
            <X :size="14" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>