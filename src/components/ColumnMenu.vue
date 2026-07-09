<script setup lang="ts">
import {
  Archive,
  ArrowRightLeft,
  ArrowUpDown,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
} from "@lucide/vue";
import { labelColorOptions } from "@/data";
import Dropdown from "./Dropdown.vue";
import DropdownMenu from "./DropdownMenu.vue";

export type ColumnMenuAction = "move" | "sort" | "complete" | "archive" | "delete";

const props = defineProps<{ completed?: boolean }>();
const emit = defineEmits<{
  action: [action: ColumnMenuAction];
  colorSelect: [color: string];
}>();
</script>

<template>
  <Dropdown align="right">
    <template #trigger="{ toggle }">
      <button type="button" aria-label="Column menu" class="text-gray-400 hover:text-gray-600" @click.stop="toggle">
        <MoreHorizontal :size="16" />
      </button>
    </template>
    <template #default="{ close }">
      <DropdownMenu
        :items="[
          { key: 'move', label: 'Move', icon: ArrowRightLeft, onSelect: () => { emit('action', 'move'); close(); } },
          { key: 'sort', label: 'Sort Tasks', icon: ArrowUpDown, onSelect: () => { emit('action', 'sort'); close(); } },
          { type: 'divider' },
          { key: 'complete', label: 'Complete Tasks', icon: CheckCircle2, checked: props.completed, onSelect: () => { emit('action', 'complete'); close(); } },
          { key: 'archive', label: 'Archive Tasks', icon: Archive, onSelect: () => { emit('action', 'archive'); close(); } },
          { type: 'divider' },
          { key: 'delete', label: 'Delete Tasks', icon: Trash2, danger: true, onSelect: () => { emit('action', 'delete'); close(); } },
        ]"
        :color-swatches="labelColorOptions"
        @color-select="(color) => { emit('colorSelect', color); close(); }"
      />
    </template>
  </Dropdown>
</template>