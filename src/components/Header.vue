<template>
  <div class="header_wrapper">

    <div class="left"></div>
    <div class="middle">{{ clcokText }}</div>
    <div class="right"></div>

  </div>
</template>

<script setup lang="ts">
// 组件
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 工具
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




</script>

<style lang="scss" scoped>
.header_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .middle {
    color: $secondary-text-color;
  }
}
</style>