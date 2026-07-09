<script setup lang="ts">
import { CalendarDays, Check, Circle, MessageSquare, Paperclip } from "@lucide/vue";
import { computed } from "vue";
import type { Card } from "@/data";

const props = defineProps<{ card: Card }>();
const progress = computed(() =>
  props.card.subtasks ? Math.round((props.card.subtasks.done / props.card.subtasks.total) * 100) : null,
);
</script>

<template>
  <div class="cursor-pointer rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md">
    <div class="mb-3 flex items-center gap-2">
      <div class="flex gap-1">
        <span v-for="(color, index) in card.tagColors" :key="index" :class="['h-1.5 w-6 rounded-full', color]" />
      </div>
      <div class="ml-auto flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
        <CalendarDays :size="12" />
        {{ card.date }}
      </div>
    </div>

    <div v-if="card.image" class="mb-3 h-28 w-full overflow-hidden rounded-xl">
      <img v-if="card.image.startsWith('/')" :src="card.image" :alt="card.title" class="h-full w-full object-cover" />
      <div v-else :class="['h-full w-full bg-linear-to-br', card.image]" />
    </div>

    <div v-if="card.images" class="mb-3 grid grid-cols-3 gap-1.5">
      <div v-for="(image, index) in card.images" :key="index" class="h-16 overflow-hidden rounded-lg">
        <img v-if="image.startsWith('/')" :src="image" :alt="`${card.title} image ${index + 1}`" class="h-full w-full object-cover" />
        <div v-else :class="['h-full w-full bg-linear-to-br', image]" />
      </div>
    </div>

    <h3 class="mb-1 text-[13.5px] font-semibold text-gray-800">{{ card.title }}</h3>
    <p v-if="card.description" class="mb-3 text-[12.5px] leading-snug text-gray-400">{{ card.description }}</p>

    <div v-if="card.subtasks" class="mb-3">
      <div class="mb-1.5 flex items-center justify-between text-[11px] text-gray-400">
        <span>SUB-TASKS: {{ card.subtasks.done }}/{{ card.subtasks.total }}</span>
        <span class="font-medium text-emerald-500">{{ progress }}%</span>
      </div>
      <div class="h-1.5 w-full rounded-full bg-gray-100">
        <div class="h-1.5 rounded-full bg-emerald-400" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <div v-if="card.subtasks?.items" class="mb-3 flex flex-col gap-1.5 rounded-xl bg-gray-50 p-2.5">
      <div v-for="item in card.subtasks.items" :key="item.title" class="flex items-center gap-2 text-[12.5px] text-gray-500">
        <span v-if="item.done" class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-white">
          <Check :size="10" :stroke-width="3" />
        </span>
        <Circle v-else :size="16" class="text-gray-300" />
        <span :class="item.done ? 'text-gray-400' : 'text-gray-600'">{{ item.title }}</span>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 text-[12px] text-gray-400">
        <span v-if="card.attachments" class="flex items-center gap-1">
          <Paperclip :size="13" />
          {{ card.attachments }}
        </span>
        <span v-if="card.comments" class="flex items-center gap-1">
          <MessageSquare :size="13" />
          {{ card.comments }}
        </span>
      </div>
      <div class="flex -space-x-2">
        <span
          v-for="(avatar, index) in card.avatars"
          :key="index"
          class="h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-gray-100"
        >
          <img v-if="avatar.image" :src="avatar.image" :alt="avatar.initials" class="h-full w-full object-cover" />
          <span
            v-else
            :class="['flex h-full w-full items-center justify-center bg-linear-to-br text-[9px] font-semibold text-white', avatar.gradient]"
          >
            {{ avatar.initials }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
