import { defineStore } from "pinia";

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarOpened: false,
    refreshKey: 0,
    isMobile: false
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened;
    },
    closeSidebar() {
      this.sidebarOpened = false;
    },
    refreshContent() {
      this.refreshKey++;
    },
    setIsMobile(val: boolean) {
      this.isMobile = val;
      !val && (this.sidebarOpened = true);
    }
  }
})