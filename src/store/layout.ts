import { defineStore } from "pinia";

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarCollapsed: false,
    refreshKey: 0
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    refreshContent() {
      this.refreshKey++;
    }
  }
})