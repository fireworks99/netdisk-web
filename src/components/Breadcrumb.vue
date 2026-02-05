<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item v-for="item in props.breadcrumbList" :key="item.path">
      <div class="flex_center">
        <el-icon v-if="item?.icon">
          <component :is="item.icon" />
        </el-icon>
        <span style="margin-left: 4px;">{{ item.title }}</span>
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
  }
})
</script>
