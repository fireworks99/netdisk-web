<template>
  <div class="preview_wrapper">
    <Image :url="props.url" :name="props.name" v-if="type === 'image'"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Image from './filetype/Image.vue';

const props = defineProps<{
  url: string,
  ext: string,
  name: string
}>();

const type = computed(() => {
  if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(props.ext)) {
    return 'image';
  } else {
    return '';
  }
})
</script>

<style lang="scss" scoped>
.preview_wrapper {
  text-align: center;
}
</style>