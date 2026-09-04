import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
    username: '',
    roles: [] as string[],
    perms: [] as string[]
  }),
  actions: {
    setUserInfo(info: { userId: number; username: string; roles: string[]; perms: string[] }) {
      this.userId = info.userId;
      this.username = info.username;
      this.roles = info.roles;
      this.perms = info.perms;
    },

    clearUserInfo() {
      this.userId = null;
      this.username = "";
      this.roles = [];
      this.perms = [];
    }
  }
})