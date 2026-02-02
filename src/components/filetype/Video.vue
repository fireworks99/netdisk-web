<template>
  <div class="video-preview">
    <!-- 可播放 -->
    <video
      v-if="isSupported"
      ref="videoRef"
      class="video-js vjs-default-skin"
    />

    <!-- 不支持 -->
    <div v-else class="video-preview__unsupported">
      <p>当前视频格式暂不支持在线预览</p>
      <p class="ext">.{{ ext }}</p>
      <p class="tip">请下载后观看，或联系管理员转码为 MP4</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface Props {
  url: string; // MinIO 预签名 URL
  ext: string; // 文件后缀，如 mp4 / avi
}

const props = defineProps<Props>();

const videoRef = ref<HTMLVideoElement | null>(null);
let player: { dispose: Function } | null = null;

// 可播放格式白名单
const SUPPORTED_VIDEO_EXTS = ['mp4', 'webm', 'ogv', 'mov'];

const isSupported = computed(() =>
  SUPPORTED_VIDEO_EXTS.includes(props.ext.toLowerCase())
);

// 根据后缀推断 MIME
const mimeType = computed(() => {
  const map: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    mov: 'video/mp4'
  };
  return map[props.ext.toLowerCase()] || 'video/mp4';
});

onMounted(() => {
  if (!isSupported.value || !videoRef.value) return;

  player = videojs(videoRef.value, {
    controls: true,
    preload: 'auto',
    fluid: true,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    sources: [
      {
        src: props.url,
        type: mimeType.value
      }
    ]
  });
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
    player = null;
  }
});
</script>