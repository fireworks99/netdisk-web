<template>
  <div class="home_wrapper">
    
    <Sidebar />
    
    <div class="main">
      <div class="header">
        <Header />
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
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