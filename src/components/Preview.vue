<template>
  <div class="preview_wrapper">
    <Image :url="props.url" :name="props.name" v-if="type === 'image'"/>
    <Office :url="props.url" :ext="props.ext" v-else-if="type === 'office'" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Image from './filetype/Image.vue';
import Office from './filetype/Office.vue';

const props = defineProps<{
  url: string,
  ext: string,
  name: string
}>();

const type = computed(() => {
  if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(props.ext)) {
    return 'image';
  } else if(['docx', 'pptx', 'pdf', 'xlsx'].includes(props.ext)) {
    return 'office';
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