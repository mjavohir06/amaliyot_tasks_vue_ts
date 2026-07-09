<script setup lang="ts">
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Search,
  ShoppingCart,
  StickyNote,
  Users,
} from "@lucide/vue";

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const mainMenu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "E-Commerce", icon: ShoppingCart, expandable: true },
  { label: "Calendar", icon: Calendar },
  { label: "Mail", icon: Mail, badge: 9 },
  { label: "Chat", icon: MessageCircle },
  { label: "Task", icon: ClipboardList, active: true },
  { label: "Projects", icon: FolderKanban },
  { label: "File Manager", icon: Users },
  { label: "Notes", icon: StickyNote },
  { label: "Contacts", icon: Users },
];
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-gray-900/30 lg:hidden" @click="$emit('close')" />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-5 shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:shadow-none',
      open ? 'translate-x-0' : '-translate-x-full lg:hidden',
    ]"
  >
    <div class="mb-6 flex items-center gap-2 px-2">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-teal-500 text-sm text-white">
        FL
      </span>
      <span class="text-lg font-semibold tracking-tight text-gray-800">FLOWER</span>
    </div>

    <div class="relative mb-6">
      <Search :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search anything"
        class="w-full rounded-lg bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-500 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-emerald-300"
      />
    </div>

    <p class="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Main Menu</p>

    <nav class="flex flex-col gap-0.5">
      <button
        v-for="item in mainMenu"
        :key="item.label"
        type="button"
        :class="[
          'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
          item.active ? 'bg-emerald-100 font-medium text-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
        ]"
      >
        <span class="flex items-center gap-3">
          <component :is="item.icon" :size="18" :class="item.active ? 'text-emerald-600' : 'text-gray-400'" />
          {{ item.label }}
        </span>
        <span class="flex items-center gap-1">
          <span
            v-if="item.badge"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white"
          >
            {{ item.badge }}
          </span>
          <ChevronRight v-if="item.expandable" :size="14" class="text-gray-300" />
        </span>
      </button>
    </nav>
  </aside>
</template>