<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import TaskBoard from "./components/TaskBoard.vue";

const sidebarOpen = ref(false);
let desktopQuery: MediaQueryList | undefined;

function syncSidebarDefault(event?: MediaQueryListEvent) {
  sidebarOpen.value = event?.matches ?? desktopQuery?.matches ?? false;
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

onMounted(() => {
  desktopQuery = window.matchMedia("(min-width: 1024px)");
  syncSidebarDefault();
  desktopQuery.addEventListener("change", syncSidebarDefault);
});

onBeforeUnmount(() => {
  desktopQuery?.removeEventListener("change", syncSidebarDefault);
});
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-100 p-0 sm:p-4">
    <div class="flex h-full w-full overflow-hidden rounded-none bg-white sm:rounded-2xl shadow-sm">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <div class="flex min-w-0 flex-1 flex-col">
        <Header :menu-open="sidebarOpen" @toggle-menu="toggleSidebar" />
        <TaskBoard />
      </div>
    </div>
  </div>
</template>