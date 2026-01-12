<template>
  <div class="home_wrapper">

    <div v-if="!layoutStore.isMobile">
      <Sidebar />
    </div>
    <el-drawer v-else v-model="layoutStore.sidebarOpened" :with-header="false" 
      size="200" direction="ltr">
      <Sidebar />
    </el-drawer>

    <div class="main">
      <div class="header">
        <Header />
      </div>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="layoutStore.refreshKey" />
          </transition>
        </router-view>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import { useLayoutStore } from '@/store/layout';

const layoutStore = useLayoutStore();
</script>

<style lang="scss" scoped>
.home_wrapper {
  height: 100%;
  display: flex;

  .main {
    height: 100%;
    flex: 1;
    min-width: 0;

    .header {
      height: $header-height;
      border-bottom: $border-std;
    }

    .content {
      height: calc(100% - $header-height);
      padding: 16px;
      overflow-y: auto;
    }
  }
}
</style>