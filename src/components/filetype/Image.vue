<template>
  <a :data-caption="props.name" :data-download-filename="props.name" v-if="props.url" style="cursor: pointer;"
    @click="openPreview">
    <img :src="props.url" :alt="props.name" style="max-width: 100%; object-fit: contain;" />
  </a>
</template>

<script setup lang="ts">
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
// import { zh_CN } from "@fancyapps/ui/dist/fancybox/l10n/zh_CN.js";

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
  // l10n: zh_CN
  l10n: {
    IMAGE_ERROR: "图片未找到",
    MOVE_UP: "向上移动",
    MOVE_DOWN: "向下移动",
    MOVE_LEFT: "向左移动",
    MOVE_RIGHT: "向右移动",
    ZOOM_IN: "放大",
    ZOOM_OUT: "缩小",
    TOGGLE_FULL: "切换缩放级别",
    TOGGLE_1TO1: "切换缩放级别",
    ITERATE_ZOOM: "切换缩放级别",
    ROTATE_CCW: "逆时针旋转",
    ROTATE_CW: "顺时针旋转",
    FLIP_X: "水平翻转",
    FLIP_Y: "垂直翻转",
    RESET: "重置",
    TOGGLE_FS: "切换全屏模式",
    ERROR: "出错了，请稍后重试",
    NEXT: "下一页",
    PREV: "上一页",
    GOTO: "跳转到 #%d 页",
    DOWNLOAD: "下载",
    TOGGLE_FULLSCREEN: "切换全屏模式",
    TOGGLE_EXPAND: "切换全屏模式",
    TOGGLE_THUMBS: "切换缩略图",
    TOGGLE_AUTOPLAY: "切换自动播放",
    CLOSE: "关闭",
    MODAL: "可按 ESC 键关闭此模态内容",
    ELEMENT_NOT_FOUND: "未找到 HTML 元素",
    IFRAME_ERROR: "加载页面时出错"
  }
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