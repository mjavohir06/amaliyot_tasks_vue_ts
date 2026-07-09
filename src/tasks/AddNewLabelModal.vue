<script setup lang="ts">
import { Copy, Plus, Trash2, X } from "@lucide/vue";
import { ref } from "vue";
import { labelColorOptions, type Label } from "@/data";
import Dropdown from "./Dropdown.vue";

const props = defineProps<{ labels: Label[] }>();
const emit = defineEmits<{ close: []; change: [labels: Label[]] }>();
const rows = ref<Label[]>(props.labels.map((label) => ({ ...label })));
let uid = 100;

function updateRow(id: string, patch: Partial<Label>) {
  rows.value = rows.value.map((row) => (row.id === id ? { ...row, ...patch } : row));
}

function duplicateRow(row: Label) {
  rows.value = [...rows.value, { ...row, id: `label-${uid++}`, name: `${row.name} copy` }];
}

function addRow() {
  rows.value = [...rows.value, { id: `label-${uid++}`, name: "", color: labelColorOptions[0] }];
}

function done() {
  emit("change", rows.value.filter((row) => row.name.trim().length > 0));
  emit("close");
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div class="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">Add New Label</h2>
        <button type="button" aria-label="Close" class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>
      <div class="mb-3 flex max-h-80 flex-col gap-2 overflow-y-auto">
        <div v-for="row in rows" :key="row.id" class="flex items-center gap-2">
          <Dropdown>
            <template #trigger="{ toggle }">
              <button type="button" aria-label="Change color" :class="['h-6 w-6 shrink-0 rounded-full ring-1 ring-inset ring-black/5', row.color]" @click="toggle" />
            </template>
            <template #default="{ close }">
              <div class="w-44 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                <p class="mb-2 text-[12px] font-semibold text-gray-500">Change Color</p>
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="color in labelColorOptions"
                    :key="color"
                    type="button"
                    :aria-label="`Color ${color}`"
                    :class="['h-6 w-6 rounded-full ring-1 ring-inset ring-black/5', color, row.color === color ? 'ring-2 ring-gray-400' : '']"
                    @click="updateRow(row.id, { color }); close()"
                  />
                </div>
              </div>
            </template>
          </Dropdown>
          <input v-model="row.name" placeholder="Type an name label..." class="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400" />
          <button type="button" aria-label="Duplicate label" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50" @click="duplicateRow(row)">
            <Copy :size="15" />
          </button>
          <button type="button" aria-label="Delete label" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500" @click="rows = rows.filter((item) => item.id !== row.id)">
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
      <button type="button" class="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-gray-800 hover:text-gray-700" @click="addRow">
        <Plus :size="15" />
        Add Label
      </button>
      <button type="button" class="w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800" @click="done">Done</button>
    </div>
  </div>
</template>
