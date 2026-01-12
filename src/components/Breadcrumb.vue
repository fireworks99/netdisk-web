<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
      <div class="flex_center">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span class="text">{{ item.meta.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutStore } from '@/store/layout';

const route = useRoute();
const breadcrumbList = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title);
});

// 路有变化时，若为移动端，关闭Sidebar
const layoutStore = useLayoutStore();
watch(
  () => route.fullPath,
  () => {
    if (layoutStore.isMobile) {
      layoutStore.closeSidebar();
    }
  }
)
</script>

<style lang="scss" scoped>
.text {
  margin-left: 4px;
}
</style>