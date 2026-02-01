<template>
  <a :data-caption="props.name" :data-download-filename="props.name" v-if="props.url" style="cursor: pointer;"
    @click="openPreview">
    <img :src="props.url" :alt="props.name" style="max-width: 100%; object-fit: contain;" />
  </a>
</template>

<script setup lang="ts">
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { zh_CN } from "@fancyapps/ui/dist/fancybox/l10n/zh_CN.js";

const props = defineProps<{
  url: string,
  name: string
}>();

const options = {
  on: {
    close: () => {
      const activeElement = document.activeElement;
      // 检查是否为 HTMLElement（有 blur 方法）
      if (activeElement instanceof HTMLElement) {
        activeElement.blur(); // 清除当前焦点
      }
    }
  },
  Carousel: {
    Toolbar: {
      display: {
        middle: [
          "zoomIn",
          "zoomOut",
          "toggle1to1",
          "rotateCCW",
          "rotateCW",
          "flipX",
          "flipY",
          "fitX",
          "fitY",
          "reset",
        ],
        right: ["fullscreen", "close"],
      }
    }
  },
  l10n: zh_CN
};

const openPreview = () => {
  if (!props.url) return;

  Fancybox.show(
    [
      {
        src: props.url,
        caption: props.name
      },
    ],
    options
  );
}
</script>