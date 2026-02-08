<template>
  <el-breadcrumb :separator="sepa">
    <el-breadcrumb-item v-for="item in renderBreadcrumbList" :key="item.path">
      <div :class="['flex_center', { cp: props.clickable && item.path !== '__ellipsis__' }]" @click="() => handleClick(item)">
        <el-icon v-if="item?.icon">
          <component :is="item.icon" />
        </el-icon>
        <span class="text">{{ item.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Breadcrumb } from '@/types';

const props = defineProps({
  breadcrumbList: {
    type: Array as PropType<Breadcrumb[]>,
    required: true,
    default: () => []
  },
  sepa: {
    type: String,
    default: '>'
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

import { computed } from 'vue';
import { Folder } from '@element-plus/icons-vue';

const MAX_VISIBLE = 4; // 可见项数量
const renderBreadcrumbList = computed<Breadcrumb[]>(() => {
  const list = props.breadcrumbList;

  if (list.length === 0) {
    return [];
  }

  if (list.length <= MAX_VISIBLE) {
    return list;
  }

  const first = list[0]!;
  const slast = list[list.length - 2]!;
  const last = list[list.length - 1]!;

  return [
    first,
    {
      title: '...',
      path: '__ellipsis__',
      icon: Folder
    },
    slast,
    last
  ];
});


const emit = defineEmits<{
  (e: 'menu-click', data: Breadcrumb): void
}>();

const handleClick = (item:Breadcrumb) => {
  emit('menu-click', item);
};
</script>

<style scoped>
.text {
  margin-left: 4px;
  max-width: 64px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>