<template>
  <audio v-if="isSupported" controls preload="none" :src="url" 
    :type="mimeType" style="width: 100%;" />

  <!-- 不支持 -->
  <div v-else class="audio-preview__unsupported">
    <p>当前音频格式暂不支持在线预览</p>
    <p class="ext">.{{ ext }}</p>
    <p class="tip">请下载后播放</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  url: string,
  ext: string
}>();

const isSupported = computed(() =>
  ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(props.ext.toLowerCase())
);

const mimeType = computed(() => {
  const map: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    m4a: 'audio/mp4',
    flac: 'audio/flac'
  };
  return map[props.ext.toLowerCase()] || 'audio/mpeg';
});
</script>