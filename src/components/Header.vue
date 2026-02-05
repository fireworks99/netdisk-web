<template>
  <div class="header_wrapper">

    <div class="left flex_center">

      <div class="icon flex_center" @click="layoutStore.toggleSidebar">
        <Menu />
      </div>

      <div class="icon flex_center" @click="layoutStore.refreshContent">
        <RefreshRight />
      </div>

      <div class="bread_wrapper">
        <Breadcrumb :breadcrumb-list="breadcrumbList"/>
      </div>

    </div>
    <div class="middle" v-if="!layoutStore.isMobile">{{ clcokText }}</div>
    <div class="right"></div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';



// -------------------------- 全局面包屑 start  ------------------------
import Breadcrumb from './Breadcrumb.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const breadcrumbList = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title).map(item => ({
      title: item.meta.title as string,  // 确保 title 存在
      path: item.path as string,
      icon: item.meta.icon as Object  // 如果有 icon 字段
    }));
});

import { useLayoutStore } from '@/store/layout';
const layoutStore = useLayoutStore();

// 路有变化时，若为移动端，关闭Sidebar
watch(
  () => route.fullPath,
  () => {
    if (layoutStore.isMobile) {
      layoutStore.closeSidebar();
    }
  }
)
// -------------------------- 全局面包屑 end  ------------------------



// -------------------------- 时钟 start  ------------------------
import dayjs from 'dayjs';
const clcokText = ref("");
const _timer = ref<number | null>(null);

const updateTime = () => {
  const weekdayMap = ['日', '一', '二', '三', '四', '五', '六'];
  const now = dayjs();
  const datePart = now.format('YYYY-MM-DD');
  const week = '星期' + weekdayMap[now.day()];
  const timePart = now.format('HH:mm:ss');
  clcokText.value = `${datePart} ${week} ${timePart}`;
}

onMounted(() => {
  updateTime();
  _timer.value = setInterval(updateTime, 1000);
})

onBeforeUnmount(() => {
  if (_timer.value) {
    clearInterval(_timer.value);
    _timer.value = null;
  }
})
// -------------------------- 时钟 end  --------------------------

</script>

<style lang="scss" scoped>
.header_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    height: 100%;
    margin-left: 16px;

    .icon {
      width: 32px;
      height: 32px;
      padding: 8px;
      color: $secondary-text-color;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        color: hsl(240 6% 10%);
        background-color: hsl(240 5% 96%);
      }
    }

    .bread_wrapper {
      margin-left: 8px;
    }
  }

  .middle {
    color: $secondary-text-color;
  }
}
</style>