<script setup lang="ts">
import {
  Check,
  ChevronDown,
  Circle,
  Link2,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Smile,
  Trash2,
  X,
} from "@lucide/vue";
import { computed, ref, watch } from "vue";
import { people, type Attachment, type Card, type ChecklistItem, type Comment, type Label } from "@/data";
import AddNewLabelModal from "./AddNewLabelModal.vue";
import AssignToPicker from "./AssignToPicker.vue";
import Dropdown from "./Dropdown.vue";
import DropdownMenu from "./DropdownMenu.vue";
import DueDatePicker from "./DueDatePicker.vue";
import LabelsPicker from "./LabelsPicker.vue";
import PersonAvatar from "./PersonAvatar.vue";

const props = defineProps<{
  card: Card;
  allLabels: Label[];
}>();

const emit = defineEmits<{
  close: [];
  labelsChange: [labels: Label[]];
  delete: [cardId: string];
  duplicate: [cardId: string];
}>();

const statusOptions = [
  { id: "todo", label: "To Do", color: "bg-gray-400" },
  { id: "in-progress", label: "In Progress", color: "bg-sky-500" },
  { id: "completed", label: "Complete", color: "bg-gray-900" },
] as const;

const status = ref<Card["status"]>(props.card.status ?? "todo");
const assignedTo = ref<string[]>([...(props.card.assignedTo ?? [])]);
const labelIds = ref<string[]>([...(props.card.labelIds ?? [])]);
const dueDate = ref<string | undefined>(props.card.dueDate);
const description = ref(props.card.longDescription ?? "");
const checklist = ref<ChecklistItem[]>([...(props.card.checklist ?? [])]);
const newChecklistText = ref("");
const tab = ref<"comments" | "activity">("comments");
const commentDraft = ref("");
const comments = ref<Comment[]>([...(props.card.commentList ?? [])]);
const attachments = ref<Attachment[]>([...(props.card.attachmentFiles ?? [])]);
const linkCopied = ref(false);
const manageLabelsOpen = ref(false);

watch(
  () => props.card,
  (card) => {
    status.value = card.status ?? "todo";
    assignedTo.value = [...(card.assignedTo ?? [])];
    labelIds.value = [...(card.labelIds ?? [])];
    dueDate.value = card.dueDate;
    description.value = card.longDescription ?? "";
    checklist.value = [...(card.checklist ?? [])];
    comments.value = [...(card.commentList ?? [])];
    attachments.value = [...(card.attachmentFiles ?? [])];
    linkCopied.value = false;
  },
);

const createdBy = computed(() => people.find((person) => person.id === props.card.createdBy));
const currentStatus = computed(() => statusOptions.find((option) => option.id === status.value) ?? statusOptions[0]);
const doneCount = computed(() => checklist.value.filter((item) => item.done).length);
const progress = computed(() => (checklist.value.length ? Math.round((doneCount.value / checklist.value.length) * 100) : 0));

function toggleChecklistItem(id: string) {
  checklist.value = checklist.value.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
}

function addChecklistItem() {
  const text = newChecklistText.value.trim();
  if (!text) return;
  checklist.value = [...checklist.value, { id: `c-${Date.now()}`, text, done: false }];
  newChecklistText.value = "";
}

function submitComment() {
  const text = commentDraft.value.trim();
  if (!text) return;
  comments.value = [...comments.value, { id: `cm-${Date.now()}`, personId: "shane", time: "Just now", text }];
  commentDraft.value = "";
}

async function copyLink() {
  const url = `${window.location.origin}${window.location.pathname}#task-${props.card.id}`;
  await navigator.clipboard?.writeText(url);
  linkCopied.value = true;
  window.setTimeout(() => {
    linkCopied.value = false;
  }, 1400);
}

function addAttachment() {
  const index = attachments.value.length + 1;
  attachments.value = [
    ...attachments.value,
    {
      id: `a-${Date.now()}`,
      name: `Attachment ${index}`,
      meta: "Added just now",
      thumbnail: "from-gray-400 to-teal-500",
    },
  ];
}
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 p-2 py-3 sm:p-4 sm:py-10" @click="emit('close')">
    <div class="w-full max-w-lg rounded-md bg-white shadow-xl sm:rounded-md" @click.stop>
      <div class="flex items-center justify-between border-b border-gray-200 px-3 py-3 sm:px-5 sm:py-3.5">
        <Dropdown>
          <template #trigger="{ toggle }">
            <button type="button" :class="['flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-white', currentStatus.color]" @click="toggle">
              {{ currentStatus.label }}
              <ChevronDown :size="14" />
            </button>
          </template>
          <template #default="{ close }">
            <DropdownMenu
              :items="statusOptions.map((option) => ({ key: option.id, label: option.label, checked: option.id === status, onSelect: () => { status = option.id; close(); } }))"
              class-name="w-40"
            />
          </template>
        </Dropdown>

        <div class="flex items-center gap-1">
          <Dropdown align="right">
            <template #trigger="{ toggle }">
              <button type="button" aria-label="More options" class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50" @click="toggle">
                <MoreHorizontal :size="17" />
              </button>
            </template>
            <template #default="{ close }">
              <DropdownMenu
                :items="[
                  { key: 'duplicate', label: 'Duplicate Task', onSelect: () => { emit('duplicate', card.id); close(); } },
                  { key: 'copy-link', label: 'Copy Link', icon: Link2, onSelect: () => { copyLink(); close(); } },
                  { type: 'divider' },
                  { key: 'delete', label: 'Delete Task', danger: true, icon: Trash2, onSelect: () => { close(); emit('delete', card.id); } },
                ]"
              />
            </template>
          </Dropdown>
          <button type="button" :aria-label="linkCopied ? 'Link copied' : 'Copy link'" :class="['flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-50', linkCopied ? 'text-gray-900' : 'text-gray-400']" @click="copyLink">
            <Check v-if="linkCopied" :size="16" />
            <Link2 v-else :size="16" />
          </button>
          <button type="button" aria-label="Close" class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50" @click="emit('close')">
            <X :size="18" />
          </button>
        </div>
      </div>

      <div class="max-h-[calc(100vh-5rem)] overflow-y-auto px-3 py-4 sm:max-h-[75vh] sm:px-5">
        <input :value="card.title" class="mb-4 w-full text-xl font-semibold text-gray-800 outline-none" />

        <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Assigned To</p>
            <AssignToPicker v-model="assignedTo" />
          </div>
          <div v-if="createdBy">
            <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Created By</p>
            <div class="flex items-center gap-2">
              <PersonAvatar :person="createdBy" :size="26" />
              <span class="text-[13px] text-gray-600">{{ createdBy.name }}</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Labels</p>
          <LabelsPicker v-model="labelIds" :all-labels="allLabels" @manage-labels="manageLabelsOpen = true" />
        </div>

        <div class="mb-5">
          <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Due Date</p>
          <DueDatePicker v-model="dueDate" />
        </div>

        <div class="mb-5">
          <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Description</p>
          <textarea
            v-model="description"
            rows="3"
            placeholder="Add a more detailed description..."
            class="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[13.5px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div class="mb-5">
          <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Checklist ({{ progress }}%)</p>
          <div class="mb-2 h-1.5 w-full rounded-full bg-gray-100">
            <div class="h-1.5 rounded-full bg-gray-700 transition-all" :style="{ width: `${progress}%` }" />
          </div>
          <div class="flex flex-col">
            <div v-for="item in checklist" :key="item.id" class="group flex items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-gray-50">
              <button type="button" aria-label="Toggle done" @click="toggleChecklistItem(item.id)">
                <span v-if="item.done" class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white">
                  <Check :size="12" :stroke-width="3" />
                </span>
                <Circle v-else :size="18" class="text-gray-300" />
              </button>
              <span :class="['flex-1 text-[13.5px]', item.done ? 'text-gray-400 line-through' : 'text-gray-700']">{{ item.text }}</span>
              <button type="button" aria-label="Remove item" class="text-gray-300 opacity-0 hover:text-red-400 group-hover:opacity-100" @click="checklist = checklist.filter((check) => check.id !== item.id)">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
          <div class="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              v-model="newChecklistText"
              placeholder="Add checklist item..."
              class="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] text-gray-600 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400"
              @keydown.enter="addChecklistItem"
            />
            <button type="button" class="flex items-center justify-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-gray-800" @click="addChecklistItem">
              <Plus :size="14" />
              Add
            </button>
          </div>
        </div>

        <div v-if="attachments.length" class="mb-5">
          <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Attachments</p>
          <div class="flex flex-col gap-2">
            <div v-for="file in attachments" :key="file.id" class="flex items-center gap-3 rounded-md border border-gray-200 p-2">
              <div :class="['h-10 w-10 shrink-0 rounded-md bg-linear-to-br', file.thumbnail]" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[13px] font-medium text-gray-700">{{ file.name }}</p>
                <p class="truncate text-[11px] text-gray-400">{{ file.meta }}</p>
              </div>
            </div>
          </div>
          <button type="button" class="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-gray-800 hover:text-gray-700" @click="addAttachment">
            <Plus :size="15" />
            Add Attachment
          </button>
        </div>

        <div>
          <div class="mb-3 flex items-center gap-4 border-b border-gray-200">
            <button
              v-for="item in ['comments', 'activity'] as const"
              :key="item"
              type="button"
              :class="['-mb-px border-b-2 pb-2 text-[13px] font-medium capitalize transition-colors', tab === item ? 'border-gray-900 text-gray-800' : 'border-transparent text-gray-400 hover:text-gray-600']"
              @click="tab = item"
            >
              {{ item }}
            </button>
          </div>

          <template v-if="tab === 'comments'">
            <div class="mb-4 flex items-start gap-2.5">
              <PersonAvatar :person="{ name: 'You', initials: 'AT', gradient: 'from-rose-400 to-orange-400', image: '/assets/image1.png' }" :size="30" />
              <div class="flex-1 rounded-md border border-gray-200 bg-gray-50 p-2">
                <textarea v-model="commentDraft" placeholder="Add a comment..." rows="2" class="w-full resize-none bg-transparent text-[13px] text-gray-600 outline-none placeholder:text-gray-400" />
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center gap-2 text-gray-400">
                    <button type="button" aria-label="Attach" class="hover:text-gray-600"><Paperclip :size="15" /></button>
                    <button type="button" aria-label="Emoji" class="hover:text-gray-600"><Smile :size="15" /></button>
                  </div>
                  <button type="button" aria-label="Send comment" class="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900 text-white hover:bg-gray-800" @click="submitComment">
                    <Send :size="13" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <div v-for="comment in comments" :key="comment.id" class="flex items-start gap-2.5">
                <PersonAvatar
                  :person="people.find((person) => person.id === comment.personId) ?? { name: 'You', initials: 'AT', gradient: 'from-rose-400 to-orange-400' }"
                  :size="30"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[13px] font-semibold text-gray-700">{{ people.find((person) => person.id === comment.personId)?.name ?? "You" }}</span>
                    <span class="text-[11px] text-gray-400">{{ comment.time }}</span>
                  </div>
                  <p class="text-[13px] text-gray-600">{{ comment.text }}</p>
                  <div v-if="comment.reactions" class="mt-1 flex gap-1">
                    <span v-for="(reaction, index) in comment.reactions" :key="index" class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[12px]">{{ reaction }}</span>
                  </div>
                </div>
              </div>
              <p v-if="comments.length === 0" class="text-[13px] text-gray-400">No comments yet.</p>
            </div>
          </template>

          <div v-else class="flex flex-col gap-3">
            <p v-if="createdBy" class="text-[13px] text-gray-500">
              <span class="font-semibold text-gray-700">{{ createdBy.name }}</span>
              created this task.
            </p>
            <p class="text-[13px] text-gray-500">
              Status changed to <span class="font-semibold text-gray-700">{{ currentStatus.label }}</span>.
            </p>
            <p v-if="assignedTo.length > 0" class="text-[13px] text-gray-500">
              Assigned to
              <span class="font-semibold text-gray-700">
                {{ assignedTo.map((id) => people.find((person) => person.id === id)?.name).filter(Boolean).join(", ") }}
              </span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddNewLabelModal
    v-if="manageLabelsOpen"
    :labels="allLabels"
    @close="manageLabelsOpen = false"
    @change="emit('labelsChange', $event)"
  />
</template>
