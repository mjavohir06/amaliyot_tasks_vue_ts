<script setup lang="ts">
import { Check, ChevronDown, Search, Tag } from "@lucide/vue";
import { computed, ref } from "vue";
import type { Label } from "@/data";
import Dropdown from "./Dropdown.vue";

const props = defineProps<{ allLabels: Label[] }>();
const emit = defineEmits<{ manageLabels: [] }>();
const selectedIds = defineModel<string[]>({ required: true });
const query = ref("");
const selected = computed(() => props.allLabels.filter((label) => selectedIds.value.includes(label.id)));
const filtered = computed(() => props.allLabels.filter((label) => label.name.toLowerCase().includes(query.value.toLowerCase())));

function toggle(id: string) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((item) => item !== id)
    : [...selectedIds.value, id];
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <span v-for="label in selected" :key="label.id" :class="['rounded-md px-2.5 py-1 text-[11px] font-medium text-white', label.color]">
      {{ label.name }}
    </span>
    <Dropdown panel-class="w-60">
      <template #trigger="{ toggle: openMenu }">
        <button type="button" class="flex items-center gap-1 rounded-md border border-dashed border-gray-300 px-2 py-1 text-[11px] text-gray-400 hover:bg-gray-50" @click="openMenu">
          <Tag :size="12" />
          Labels
          <ChevronDown :size="12" />
        </button>
      </template>
      <template #default="{ close }">
        <div class="w-60 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
          <p class="mb-2 text-[13px] font-semibold text-gray-700">Labels</p>
          <div class="relative mb-2">
            <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="query" autofocus placeholder="Search label..." class="w-full rounded-lg bg-gray-50 py-1.5 pl-8 pr-3 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-emerald-300" />
          </div>
          <div class="mb-2 flex max-h-48 flex-col overflow-y-auto">
            <button v-for="label in filtered" :key="label.id" type="button" class="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left hover:bg-gray-50" @click="toggle(label.id)">
              <span :class="['h-3 w-3 rounded-full', label.color]" />
              <span class="flex-1 text-[13px] text-gray-600">{{ label.name }}</span>
              <Check v-if="selectedIds.includes(label.id)" :size="15" class="text-emerald-500" />
            </button>
            <p v-if="filtered.length === 0" class="px-1.5 py-2 text-[13px] text-gray-400">No labels found.</p>
          </div>
          <button type="button" class="w-full rounded-lg bg-emerald-500 py-2 text-[13px] font-medium text-white hover:bg-emerald-600" @click="close(); emit('manageLabels')">
            Add New Label
          </button>
        </div>
      </template>
    </Dropdown>
  </div>
</template>
