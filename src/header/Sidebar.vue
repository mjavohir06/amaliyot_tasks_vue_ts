<script setup lang="ts">
import { Calendar, ClipboardList, FolderKanban, Inbox, Search, Settings, StickyNote, Users } from "@lucide/vue";

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const mainMenu = [
  { label: "Inbox", icon: Inbox },
  { label: "Tasks", icon: ClipboardList, active: true },
  { label: "Projects", icon: FolderKanban },
  { label: "Calendar", icon: Calendar },
  { label: "Notes", icon: StickyNote },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-gray-900/25 lg:hidden" @click="$emit('close')" />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex h-full w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-3 py-4 shadow-lg transition-transform duration-200 lg:static lg:z-auto lg:shadow-none',
      open ? 'translate-x-0' : '-translate-x-full lg:hidden',
    ]"
  >
    <div class="mb-5 flex items-center gap-2 px-2">
      <span class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-800">
        TB
      </span>
      <span class="text-base font-semibold text-gray-900">Task Board</span>
    </div>

    <div class="relative mb-5">
      <Search :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        class="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400"
      />
    </div>

    <p class="mb-2 px-2 text-[11px] font-medium uppercase text-gray-500">Workspace</p>

    <nav class="flex flex-col gap-0.5">
      <button
        v-for="item in mainMenu"
        :key="item.label"
        type="button"
        :class="[
          'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
          item.active ? 'bg-gray-900 font-medium text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        ]"
      >
        <component :is="item.icon" :size="18" :class="item.active ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'" />
        {{ item.label }}
      </button>
    </nav>
  </aside>
</template>