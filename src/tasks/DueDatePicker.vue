<script setup lang="ts">
import { CalendarDays, ChevronLeft, ChevronRight } from "@lucide/vue";
import { computed, ref } from "vue";
import Dropdown from "./Dropdown.vue";

const value = defineModel<string | undefined>({ required: true });
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date();
const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth());
const selectedDay = ref<number | null>(today.getDate());
const time = ref("09:00 AM");

const cells = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay();
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
  return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)] as (number | null)[];
});

function shiftMonth(delta: number) {
  let month = viewMonth.value + delta;
  let year = viewYear.value;
  if (month < 0) {
    month = 11;
    year -= 1;
  }
  if (month > 11) {
    month = 0;
    year += 1;
  }
  viewMonth.value = month;
  viewYear.value = year;
}
</script>

<template>
  <Dropdown panel-class="w-72">
    <template #trigger="{ toggle }">
      <button type="button" class="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-100" @click="toggle">
        <CalendarDays :size="14" class="text-gray-400" />
        {{ value ?? "Set due date" }}
      </button>
    </template>
    <template #default="{ close }">
      <div class="w-72 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
        <div class="mb-2 flex items-center justify-between">
          <button type="button" aria-label="Previous month" class="rounded-md p-1 text-gray-400 hover:bg-gray-50" @click="shiftMonth(-1)">
            <ChevronLeft :size="16" />
          </button>
          <span class="text-[13px] font-semibold text-gray-700">{{ months[viewMonth] }} {{ viewYear }}</span>
          <button type="button" aria-label="Next month" class="rounded-md p-1 text-gray-400 hover:bg-gray-50" @click="shiftMonth(1)">
            <ChevronRight :size="16" />
          </button>
        </div>
        <div class="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-gray-400">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>
        <div class="grid grid-cols-7 gap-y-1 text-center text-[12.5px]">
          <button
            v-for="(day, index) in cells"
            :key="index"
            type="button"
            :disabled="day === null"
            :class="[
              'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
              day === null ? 'invisible' : day === selectedDay ? 'bg-gray-900 font-semibold text-white' : 'text-gray-600 hover:bg-gray-50',
            ]"
            @click="selectedDay = day"
          >
            {{ day }}
          </button>
        </div>
        <div class="mt-3">
          <label class="mb-1 block text-[11px] font-medium text-gray-400">Time</label>
          <input v-model="time" class="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] text-gray-600 outline-none focus:ring-1 focus:ring-gray-400" />
        </div>
        <div class="mt-3 flex items-center justify-between">
          <button type="button" class="text-[12.5px] font-medium text-gray-400 hover:text-gray-600" @click="value = undefined; close()">Clear due date</button>
          <button
            type="button"
            class="rounded-md bg-gray-900 px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-gray-800"
            @click="if (selectedDay) value = `${months[viewMonth].slice(0, 3)} ${selectedDay}, ${viewYear}, ${time}`; close()"
          >
            Set due date
          </button>
        </div>
      </div>
    </template>
  </Dropdown>
</template>
