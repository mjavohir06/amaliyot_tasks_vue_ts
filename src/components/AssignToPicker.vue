<script setup lang="ts">
import { Check, Plus, Search } from "@lucide/vue";
import { computed, ref } from "vue";
import { people } from "@/data";
import Dropdown from "./Dropdown.vue";
import PersonAvatar from "./PersonAvatar.vue";

const assignedIds = defineModel<string[]>({ required: true });
const query = ref("");
const assigned = computed(() => people.filter((person) => assignedIds.value.includes(person.id)));
const filtered = computed(() => people.filter((person) => person.name.toLowerCase().includes(query.value.toLowerCase())));

function toggle(id: string) {
  assignedIds.value = assignedIds.value.includes(id)
    ? assignedIds.value.filter((item) => item !== id)
    : [...assignedIds.value, id];
}
</script>

<template>
  <div class="flex items-center gap-1">
    <div class="flex -space-x-2">
      <PersonAvatar v-for="person in assigned" :key="person.id" :person="person" />
    </div>
    <Dropdown panel-class="w-56">
      <template #trigger="{ toggle: openMenu }">
        <button type="button" aria-label="Assign people" class="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 hover:bg-gray-50" @click="openMenu">
          <Plus :size="14" />
        </button>
      </template>
      <div class="w-56 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
        <p class="mb-2 text-[13px] font-semibold text-gray-700">Assign To</p>
        <div class="relative mb-2">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="query" autofocus placeholder="Find name..." class="w-full rounded-lg bg-gray-50 py-1.5 pl-8 pr-3 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-emerald-300" />
        </div>
        <div class="flex max-h-48 flex-col overflow-y-auto">
          <button v-for="person in filtered" :key="person.id" type="button" class="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left text-[13px] text-gray-600 hover:bg-gray-50" @click="toggle(person.id)">
            <PersonAvatar :person="person" :size="24" />
            <span class="flex-1">{{ person.name }}</span>
            <Check v-if="assignedIds.includes(person.id)" :size="15" class="text-emerald-500" />
          </button>
          <p v-if="filtered.length === 0" class="px-1.5 py-2 text-[13px] text-gray-400">No one found.</p>
        </div>
      </div>
    </Dropdown>
  </div>
</template>
