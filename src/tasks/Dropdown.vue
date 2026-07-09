<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    align?: "left" | "right";
    panelClass?: string;
  }>(),
  {
    align: "left",
    panelClass: "",
  },
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function close() {
  open.value = false;
}

function toggle() {
  open.value = !open.value;
}

function handleClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) {
    close();
  }
}

function handleKey(event: KeyboardEvent) {
  if (event.key === "Escape") close();
}

onMounted(() => {
  document.addEventListener("mousedown", handleClick);
  document.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClick);
  document.removeEventListener("keydown", handleKey);
});
</script>

<template>
  <div ref="root" class="relative inline-block">
    <slot name="trigger" :open="open" :toggle="toggle" :close="close" />
    <div
      v-if="open"
      :class="[
        'absolute top-full z-30 mt-2',
        props.align === 'right' ? 'right-0' : 'left-0',
        props.panelClass,
      ]"
    >
      <slot :close="close" />
    </div>
  </div>
</template>
