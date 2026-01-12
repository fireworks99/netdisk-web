<template>
  <div :class="['sidebar_wrapper', { collapse: layoutStore.sidebarCollapsed }]">

    <div class="header flex_center" @click="$router.push('/')">
      <div class="icon flex_center">
        <img src="@/assets/images/logo.svg" alt="">
      </div>
      <div class="text">NetDisk</div>
    </div>

    <div class="content">

      <el-scrollbar>

        <el-menu router :default-active="$route.path" :default-openeds="openeds">

          <div v-for="item in routes" :key="item.path">

            <div v-if="!item.meta.hidden">

              <el-sub-menu :index="item.path" v-if="item?.children && item.children.length > 0">
                <template #title>
                  <el-icon v-if="item.meta?.icon">
                    <component :is="item.meta.icon" />
                  </el-icon>
                  <span>{{ item.meta.title }}</span>
                </template>

                <el-menu-item :index="`${item.path}/${sub.path}`" v-for="sub in item.children" :key="sub.path">
                  <el-icon v-if="sub.meta?.icon">
                    <component :is="sub.meta.icon" />
                  </el-icon>
                  <span>{{ sub.meta.title }}</span>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item :index="item.path" v-else>
                <el-icon v-if="item.meta?.icon">
                  <component :is="item.meta.icon" />
                </el-icon>
                <span>{{ item.meta.title }}</span>
              </el-menu-item>

            </div>

          </div>

        </el-menu>

      </el-scrollbar>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { routes } from '@/router';
import { useLayoutStore } from '@/store/layout';

const openeds = ref(['/mine', '/user', '/sys']);

// -------------------------- Sidebar切换 start  ------------------------
const layoutStore = useLayoutStore();
// -------------------------- Sidebar切换 end  --------------------------

</script>

<style lang="scss" scoped>
.sidebar_wrapper {
  height: 100%;
  border-right: $border-std;
  width: $sidebar-width;
  transition: width .15s ease;
  
  &.collapse {
    width: 0;
    overflow: hidden;
  }

  .header {
    height: $header-height;
    gap: 16px;
    cursor: pointer;

    .text {
      font-size: 18px;
      font-weight: bold;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .content {
    height: calc(100% - $header-height);
  }

}
</style>
