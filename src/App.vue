<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import Header from "./header/Header.vue";
import Sidebar from "./header/Sidebar.vue";
import TaskBoard from "./tasks/TaskBoard.vue";

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
  <div class="flex h-screen w-full overflow-hidden bg-gray-100 p-0">
    <div class="flex h-full w-full overflow-hidden bg-white">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <div class="flex min-w-0 flex-1 flex-col">
        <Header :menu-open="sidebarOpen" @toggle-menu="toggleSidebar" />
        <TaskBoard />
      </div>
    </div>
  </div>
</template>