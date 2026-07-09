<script setup lang="ts">
import { Check } from "@lucide/vue";

type MenuItem = {
  type?: "divider";
  key?: string;
  label?: string;
  icon?: object;
  checked?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

defineProps<{
  items: MenuItem[];
  colorSwatches?: string[];
  className?: string;
}>();

const emit = defineEmits<{
  colorSelect: [color: string];
}>();
</script>

<template>
  <div :class="['w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg', className]">
    <template v-for="(item, index) in items" :key="item.type === 'divider' ? `div-${index}` : item.key">
      <div v-if="item.type === 'divider'" class="my-1 h-px bg-gray-100" />
      <button
        v-else
        type="button"
        :disabled="item.disabled"
        :class="[
          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
          item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50',
        ]"
        @click="item.onSelect?.()"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          :size="16"
          :class="item.danger ? 'text-red-400' : 'text-gray-400'"
        />
        <span class="flex-1">{{ item.label }}</span>
        <Check v-if="item.checked" :size="15" class="text-emerald-500" />
      </button>
    </template>

    <div v-if="colorSwatches?.length" class="grid grid-cols-6 gap-2 px-2 py-2.5">
      <button
        v-for="color in colorSwatches"
        :key="color"
        type="button"
        :aria-label="`Select color ${color}`"
        :class="['h-5 w-5 rounded-full ring-1 ring-inset ring-black/5', color]"
        @click="emit('colorSelect', color)"
      />
    </div>
  </div>
</template>
