<template>
  <Home />
</template>

<script setup lang="ts">
import Home from '@/views/Home.vue';
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useLayoutStore } from '@/store/layout';

const layoutStore = useLayoutStore();

watch(
  () => layoutStore.isMobile,
  val => {
    const app = document.getElementById("app");
    app?.classList.remove('mobile', 'pc')
    app?.classList.add(val ? 'mobile' : 'pc')
  },
  { immediate: true }
)

const resizeHandler = () => {
  layoutStore.setIsMobile(window.innerWidth < 768);
}

onMounted(() => {
  resizeHandler()
  window.addEventListener('resize', resizeHandler);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
})
</script>
