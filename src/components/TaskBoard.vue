<script setup lang="ts">
import { Plus, SlidersHorizontal } from "@lucide/vue";
import { computed, ref } from "vue";
import { columns, labels as initialLabels, type Card, type Column, type Label } from "@/data";
import AddMenu, { type AddMenuAction } from "./AddMenu.vue";
import ColumnMenu, { type ColumnMenuAction } from "./ColumnMenu.vue";
import FilterPanel, { type FilterCriteria } from "./FilterPanel.vue";
import ProjectSwitcher from "./ProjectSwitcher.vue";
import TaskCard from "./TaskCard.vue";
import TaskDetailsModal from "./TaskDetailsModal.vue";

const boardColumns = ref<Column[]>(columns.map((column) => ({ ...column, cards: column.cards.map((card) => ({ ...card })) })));
const activeColumn = ref(boardColumns.value[0]?.id ?? "todo");
const filterOpen = ref(false);
const selectedCardId = ref<string | null>(null);
const allLabels = ref<Label[]>(initialLabels.map((label) => ({ ...label })));
const filters = ref<FilterCriteria | null>(null);
let taskId = 100;
let columnId = 100;

const selectedCard = computed(() =>
  selectedCardId.value ? boardColumns.value.flatMap((column) => column.cards).find((card) => card.id === selectedCardId.value) ?? null : null,
);

const visibleColumns = computed(() => {
  if (!filters.value) return boardColumns.value;
  const criteria = filters.value;
  const query = criteria.query.trim().toLowerCase();
  const statusMap: Record<string, Card["status"] | undefined> = {
    "To do": "todo",
    "In progress": "in-progress",
    Completed: "completed",
  };

  return boardColumns.value.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => {
      const matchesQuery = !query || [card.title, card.description, card.longDescription].some((value) => value?.toLowerCase().includes(query));
      const matchesLabels = criteria.labelIds.length === 0 || criteria.labelIds.every((id) => card.labelIds?.includes(id));
      const matchesMembers = criteria.memberIds.length === 0 || criteria.memberIds.every((id) => card.assignedTo?.includes(id));
      const status = statusMap[criteria.status];
      const matchesStatus = !status || card.status === status;
      const matchesDueDate = criteria.dueDate === "Due anytime" || Boolean(card.dueDate);
      return matchesQuery && matchesLabels && matchesMembers && matchesStatus && matchesDueDate;
    }),
  }));
});

function makeTask(columnIdValue = activeColumn.value): Card {
  const id = `${taskId++}`;
  return {
    id,
    title: `New Task ${id}`,
    description: "Click to edit task details.",
    date: "Today",
    tagColors: ["bg-emerald-400", "bg-gray-200"],
    avatars: [],
    status: columnIdValue === "completed" ? "completed" : columnIdValue === "in-progress" ? "in-progress" : "todo",
    labelIds: [],
    assignedTo: [],
  };
}

function updateColumn(columnIdValue: string, updater: (column: Column) => Column) {
  boardColumns.value = boardColumns.value.map((column) => (column.id === columnIdValue ? updater(column) : column));
}

function addTask(columnIdValue = activeColumn.value) {
  updateColumn(columnIdValue, (column) => ({ ...column, cards: [...column.cards, makeTask(column.id)] }));
  activeColumn.value = columnIdValue;
}

function addColumn(title = `New Column ${columnId++}`) {
  const id = `column-${columnId++}`;
  boardColumns.value = [...boardColumns.value, { id, title: title.toUpperCase(), color: "bg-violet-400", cards: [] }];
  activeColumn.value = id;
}

function handleAdd(action: AddMenuAction) {
  if (action === "task") addTask();
  if (action === "board" || action === "project") addColumn(action === "board" ? "New Board" : "New Project");
  if (action === "invite") addTask();
}

function handleColumnAction(columnIdValue: string, action: ColumnMenuAction) {
  if (action === "move") {
    const index = boardColumns.value.findIndex((column) => column.id === columnIdValue);
    if (index < 0) return;
    const next = [...boardColumns.value];
    const [column] = next.splice(index, 1);
    next.splice(index === next.length ? 0 : index + 1, 0, column);
    boardColumns.value = next;
  }

  if (action === "sort") {
    updateColumn(columnIdValue, (column) => ({ ...column, cards: [...column.cards].sort((a, b) => a.title.localeCompare(b.title)) }));
  }

  if (action === "complete") {
    updateColumn(columnIdValue, (column) => ({ ...column, cards: column.cards.map((card) => ({ ...card, status: "completed" })) }));
  }

  if (action === "archive" || action === "delete") {
    updateColumn(columnIdValue, (column) => ({ ...column, cards: [] }));
    if (selectedCard.value && !boardColumns.value.flatMap((column) => column.cards).some((card) => card.id === selectedCard.value?.id)) {
      selectedCardId.value = null;
    }
  }
}

function updateColumnColor(columnIdValue: string, color: string) {
  updateColumn(columnIdValue, (column) => ({ ...column, color }));
}

function deleteTask(cardId: string) {
  boardColumns.value = boardColumns.value.map((column) => ({ ...column, cards: column.cards.filter((card) => card.id !== cardId) }));
  selectedCardId.value = null;
}

function duplicateTask(cardId: string) {
  for (const column of boardColumns.value) {
    const card = column.cards.find((item) => item.id === cardId);
    if (!card) continue;
    const id = `${taskId++}`;
    updateColumn(column.id, (target) => ({ ...target, cards: [...target.cards, { ...card, id, title: `${card.title} copy` }] }));
    return;
  }
}

function applyFilters(criteria: FilterCriteria) {
  filters.value = criteria;
  filterOpen.value = false;
}
</script>

<template>
  <div class="relative flex min-h-0 flex-1 overflow-hidden">
    <div class="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 md:overflow-x-auto">
      <div class="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <ProjectSwitcher />
        <div class="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <button
            type="button"
            aria-label="Sort"
            :class="[
              'flex h-9 w-9 items-center justify-center rounded-lg border text-gray-400 hover:bg-gray-50',
              filterOpen || filters ? 'border-emerald-300 bg-emerald-50 text-emerald-500' : 'border-gray-100',
            ]"
            @click="filterOpen = !filterOpen"
          >
            <SlidersHorizontal :size="16" />
          </button>
          <AddMenu @select="handleAdd" />
        </div>
      </div>

      <div class="flex flex-col gap-4 pb-4 md:flex-row md:gap-5 md:pb-2">
        <div
          v-for="column in visibleColumns"
          :key="column.id"
          :class="[
            'flex w-full shrink-0 flex-col rounded-xl border-2 bg-gray-50/60 p-3 transition-colors sm:rounded-2xl md:w-75',
            activeColumn === column.id ? 'border-sky-500' : 'border-transparent',
          ]"
          @click="activeColumn = column.id"
        >
          <div class="mb-3 flex items-center justify-between px-1">
            <div class="flex min-w-0 items-center gap-2">
              <span :class="['h-2 w-2 rounded-full', column.color]" />
              <span class="truncate text-xs font-semibold tracking-wide text-gray-500">{{ column.title }}</span>
              <span class="rounded-md bg-gray-200/70 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">{{ column.cards.length }}</span>
            </div>
            <ColumnMenu
              :completed="column.id === 'completed'"
              @action="(action) => handleColumnAction(column.id, action)"
              @color-select="(color) => updateColumnColor(column.id, color)"
            />
          </div>

          <div class="flex flex-col gap-3">
            <TaskCard v-for="card in column.cards" :key="card.id" :card="card" @click.stop="selectedCardId = card.id" />
            <p v-if="column.cards.length === 0" class="rounded-xl border border-dashed border-gray-200 py-6 text-center text-[13px] text-gray-400">No tasks</p>
          </div>

          <button type="button" class="mt-3 flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-2 text-gray-400 hover:bg-gray-100" @click.stop="addTask(column.id)">
            <Plus :size="16" />
          </button>
        </div>
      </div>
    </div>

    <FilterPanel v-if="filterOpen" :all-labels="allLabels" @apply="applyFilters" @close="filterOpen = false" />

    <TaskDetailsModal
      v-if="selectedCard"
      :card="selectedCard"
      :all-labels="allLabels"
      @labels-change="allLabels = $event"
      @duplicate="duplicateTask"
      @delete="deleteTask"
      @close="selectedCardId = null"
    />
  </div>
</template>