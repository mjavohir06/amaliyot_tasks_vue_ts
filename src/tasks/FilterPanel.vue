<script setup lang="ts">
import { Check, ChevronDown, Search, X } from "@lucide/vue";
import { ref } from "vue";
import { people, type Label } from "@/data";
import Dropdown from "./Dropdown.vue";
import DropdownMenu from "./DropdownMenu.vue";
import PersonAvatar from "./PersonAvatar.vue";

defineProps<{ allLabels: Label[] }>();
export type FilterCriteria = { query: string; labelIds: string[]; memberIds: string[]; dueDate: string; status: string };
const emit = defineEmits<{ close: []; apply: [criteria: FilterCriteria] }>();
const dueDateOptions = ["Due anytime", "Overdue", "Due today", "Due this week"];
const statusOptions = ["Any status", "To do", "In progress", "Completed"];
const query = ref("");
const labelIds = ref<string[]>([]);
const memberIds = ref<string[]>([]);
const dueDate = ref(dueDateOptions[0]);
const status = ref(statusOptions[0]);

function toggleLabel(id: string) {
  labelIds.value = labelIds.value.includes(id) ? labelIds.value.filter((item) => item !== id) : [...labelIds.value, id];
}

function reset() {
  query.value = "";
  labelIds.value = [];
  memberIds.value = [];
  dueDate.value = dueDateOptions[0];
  status.value = statusOptions[0];
  apply();
}

function apply() {
  emit("apply", {
    query: query.value,
    labelIds: [...labelIds.value],
    memberIds: [...memberIds.value],
    dueDate: dueDate.value,
    status: status.value,
  });
}
</script>

<template>
  <aside class="fixed inset-y-0 right-0 z-30 flex h-full w-full max-w-sm shrink-0 flex-col border-l border-gray-200 bg-white p-4 shadow-xl sm:p-5 md:static md:w-80 md:shadow-none">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">Filter</h2>
      <button type="button" aria-label="Close filter" class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50" @click="emit('close')">
        <X :size="18" />
      </button>
    </div>
    <div class="relative mb-5">
      <Search :size="15" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input v-model="query" placeholder="Search tasks" class="w-full rounded-md bg-gray-50 py-2 pl-9 pr-3 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:border-gray-400" />
    </div>
    <div class="mb-5">
      <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Labels</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="label in allLabels"
          :key="label.id"
          type="button"
          :class="[
            'flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
            labelIds.includes(label.id) ? `${label.color} text-white` : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          ]"
          @click="toggleLabel(label.id)"
        >
          {{ label.name }}
          <Check v-if="labelIds.includes(label.id)" :size="11" />
        </button>
      </div>
    </div>
    <div class="mb-5">
      <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Members</p>
      <div class="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 p-2">
        <span v-for="id in memberIds" :key="id" class="flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-1 pr-2 text-[12px] text-gray-600">
          <PersonAvatar v-if="people.find((person) => person.id === id)" :person="people.find((person) => person.id === id)!" :size="18" />
          {{ people.find((person) => person.id === id)?.name }}
          <button type="button" aria-label="Remove member" class="text-gray-400 hover:text-gray-600" @click="memberIds = memberIds.filter((item) => item !== id)">
            <X :size="12" />
          </button>
        </span>
        <Dropdown>
          <template #trigger="{ toggle }">
            <button type="button" aria-label="Add member" class="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50" @click="toggle">
              <Search :size="14" />
            </button>
          </template>
          <template #default="{ close }">
            <div class="w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
              <button
                v-for="person in people.filter((person) => !memberIds.includes(person.id))"
                :key="person.id"
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-gray-600 hover:bg-gray-50"
                @click="memberIds = [...memberIds, person.id]; close()"
              >
                <PersonAvatar :person="person" :size="22" />
                {{ person.name }}
              </button>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="mb-5">
      <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Due Date</p>
      <Dropdown panel-class="w-full">
        <template #trigger="{ toggle }">
          <button type="button" class="flex w-full items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-100" @click="toggle">
            {{ dueDate }}
            <ChevronDown :size="14" class="text-gray-400" />
          </button>
        </template>
        <template #default="{ close }">
          <DropdownMenu :items="dueDateOptions.map((option) => ({ key: option, label: option, checked: option === dueDate, onSelect: () => { dueDate = option; close(); } }))" class-name="w-full" />
        </template>
      </Dropdown>
    </div>
    <div class="mb-6">
      <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Status</p>
      <Dropdown panel-class="w-full">
        <template #trigger="{ toggle }">
          <button type="button" class="flex w-full items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-100" @click="toggle">
            {{ status }}
            <ChevronDown :size="14" class="text-gray-400" />
          </button>
        </template>
        <template #default="{ close }">
          <DropdownMenu :items="statusOptions.map((option) => ({ key: option, label: option, checked: option === status, onSelect: () => { status = option; close(); } }))" class-name="w-full" />
        </template>
      </Dropdown>
    </div>
    <div class="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <button type="button" class="flex-1 rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800" @click="apply">Apply filters</button>
      <button type="button" class="text-center text-[13px] font-medium text-red-500 hover:text-red-600" @click="reset">Reset filters</button>
    </div>
  </aside>
</template>
