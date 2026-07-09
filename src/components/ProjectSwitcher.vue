<script setup lang="ts">
import { Check, ChevronDown, LayoutGrid, Search } from "@lucide/vue";
import { computed, ref } from "vue";
import Dropdown from "./Dropdown.vue";

const projects = [
  { id: "design-plans", name: "Design Plans" },
  { id: "wireframe-ui-kit", name: "Wireframe UI Kit" },
  { id: "admin-dashboard", name: "Admin Dashboard" },
  { id: "sochi-hotel", name: "Sochi - Hotel Booking" },
];

const active = ref("design-plans");
const query = ref("");
const activeProject = computed(() => projects.find((project) => project.id === active.value)?.name ?? "Design Plans");
const filtered = computed(() => projects.filter((project) => project.name.toLowerCase().includes(query.value.toLowerCase())));
</script>

<template>
  <Dropdown panel-class="w-[calc(100vw-2rem)] sm:w-64">
    <template #trigger="{ toggle }">
      <button type="button" class="flex min-w-0 max-w-full items-center gap-1.5 text-base font-semibold text-gray-800 sm:text-lg" @click="toggle">
        <span class="truncate">{{ activeProject }}</span>
        <ChevronDown :size="18" class="text-gray-400" />
      </button>
    </template>
    <template #default="{ close }">
      <div class="w-full rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
        <p class="mb-2 px-1 text-[13px] font-semibold text-gray-700">Projects</p>
        <div class="relative mb-2">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="query"
            autofocus
            placeholder="Search Project..."
            class="w-full rounded-lg bg-gray-50 py-1.5 pl-8 pr-3 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-emerald-300"
          />
        </div>
        <div class="flex flex-col">
          <button
            v-for="project in filtered"
            :key="project.id"
            type="button"
            class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13.5px] text-gray-600 hover:bg-gray-50"
            @click="active = project.id; close()"
          >
            <LayoutGrid :size="16" class="text-gray-400" />
            <span class="flex-1">{{ project.name }}</span>
            <Check v-if="project.id === active" :size="15" class="text-emerald-500" />
          </button>
          <p v-if="filtered.length === 0" class="px-2 py-2 text-[13px] text-gray-400">No projects found.</p>
        </div>
      </div>
    </template>
  </Dropdown>
</template>
