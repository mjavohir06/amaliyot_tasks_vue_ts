<script setup lang="ts">
import type { Person } from "@/data";

const props = withDefaults(
  defineProps<{
    person: Pick<Person, "name" | "initials" | "gradient" | "image">;
    size?: number;
  }>(),
  {
    size: 28,
  },
);
</script>

<template>
  <span
    v-if="props.person.image"
    class="shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <img :src="props.person.image" :alt="props.person.name" class="h-full w-full object-cover" />
  </span>
  <span
    v-else
    :class="[
      'flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-linear-to-br font-semibold text-white',
      props.person.gradient,
    ]"
    :style="{
      width: `${props.size}px`,
      height: `${props.size}px`,
      fontSize: `${props.size * 0.34}px`,
    }"
  >
    {{ props.person.initials }}
  </span>
</template>
