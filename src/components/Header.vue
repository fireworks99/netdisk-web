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
        <Breadcrumb />
      </div>

    </div>
    <div class="middle">{{ clcokText }}</div>
    <div class="right"></div>

  </div>
</template>

<script setup lang="ts">
// 组件
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayoutStore } from '@/store/layout';
import Breadcrumb from './Breadcrumb.vue';

// 工具
import dayjs from 'dayjs';


// -------------------------- 时钟 start  ------------------------
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

// -------------------------- Sidebar切换 start  ------------------------
const layoutStore = useLayoutStore();
// -------------------------- Sidebar切换 end  --------------------------

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