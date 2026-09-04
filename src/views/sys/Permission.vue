<template>
  <div class="perm_wrapper">

    <ComTable ref="comTableRef" :real-data="perms" @refresh="loadTableData">

      <!-- 1. 查询条件 -->
      <template #conditions></template>

      <!-- 2. 按钮组 -->
      <template #ops></template>

      <!-- 3. 表格列 -->
      <template #columns>
        <el-table-column prop="permissionName" label="权限名" show-overflow-tooltip
          :width="layoutStore.isMobile ? 100 : undefined"></el-table-column>
        <el-table-column prop="permissionCode" label="权限码" align="center"
          :width="layoutStore.isMobile ? 100 : undefined">
          <template #default="scope">
            <el-tag :type="getTag(scope.row.permissionCode)">{{ scope.row.permissionCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"
          :formatter="(_: any, __: any, c: any) => dayjs(c).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
      </template>

    </ComTable>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SysPermission } from '@/types/modules/perm';
import { getPerms } from '@/api/system/perm';
import dayjs from 'dayjs';
import { useLayoutStore } from '@/store/layout';
import ComTable from '@/components/ComTable.vue';

const layoutStore = useLayoutStore();

const perms = ref<SysPermission[]>([]);
const comTableRef = ref<InstanceType<typeof ComTable> | null>(null);

const loadTableData = async () => {
  try {
    const res = await getPerms({
      pageNum: comTableRef?.value?.currentPage,
      pageSize: comTableRef?.value?.pageSize
    });
    perms.value = res.data.data.records;
    comTableRef.value && (comTableRef.value.total = res.data.data.total);
  } catch (e) { }
}

const getTag = (code: string) => {
  const obj = {
    add: 'primary',
    view: 'success',
    update: 'warning',
    delete: 'danger',
    other: 'info'
  };

  const text = code.split(':').pop();

  if (text && text in obj) {
    return obj[text as keyof typeof obj];
  }
  
  return obj.other;
}
</script>

<style lang="scss" scoped>
.perm_wrapper {
  height: 100%;
}
</style>