<script setup lang="ts">
import { ChevronDown, ClipboardList, FolderKanban, LayoutGrid, UserPlus } from "@lucide/vue";
import Dropdown from "./Dropdown.vue";
import DropdownMenu from "./DropdownMenu.vue";

export type AddMenuAction = "task" | "board" | "project" | "invite";

const emit = defineEmits<{ select: [action: AddMenuAction] }>();

const items = [
  { key: "task", label: "Task", icon: ClipboardList },
  { key: "board", label: "Column", icon: LayoutGrid },
  { key: "project", label: "Project", icon: FolderKanban },
  { key: "invite", label: "Invite member", icon: UserPlus },
] as const;
</script>

<template>
  <Dropdown align="right">
    <template #trigger="{ toggle }">
      <button type="button" class="flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:px-4" @click="toggle">`r`n        New`r`n        <ChevronDown :size="15" />
      </button>
    </template>
    <template #default="{ close }">
      <DropdownMenu
        :items="items.map((item) => ({ ...item, onSelect: () => { emit('select', item.key); close(); } }))"
      />
    </template>
  </Dropdown>
</template>