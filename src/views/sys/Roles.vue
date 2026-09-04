<template>
  <div class="role_wrapper">

    <ComTable ref="comTableRef" :real-data="roles" @refresh="loadTableData">

      <!-- 1. 查询条件 -->
      <template #conditions></template>

      <!-- 2. 按钮组 -->
      <template #ops></template>

      <!-- 3. 表格列 -->
      <template #columns>
        <el-table-column prop="roleName" label="角色名" show-overflow-tooltip
          :width="layoutStore.isMobile ? 100 : undefined"></el-table-column>
        <el-table-column prop="roleCode" label="角色码" align="center" :width="layoutStore.isMobile ? 100 : undefined">
          <template #default="scope">
            <el-tag :type="scope.row.roleCode === 'ROLE_ADMIN' ? 'success' : 'primary'">{{ scope.row.roleCode
              }}</el-tag>
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
import type { SysRole } from '@/types/modules/role';
import { getRoles } from '@/api/system/role';
import dayjs from 'dayjs';
import { useLayoutStore } from '@/store/layout';
import ComTable from '@/components/ComTable.vue';

const layoutStore = useLayoutStore();

const roles = ref<SysRole[]>([]);
const comTableRef = ref<InstanceType<typeof ComTable> | null>(null);

const loadTableData = async () => {
  try {
    const res = await getRoles({
      pageNum: comTableRef?.value?.currentPage,
      pageSize: comTableRef?.value?.pageSize
    });
    roles.value = res.data.data.records;
    comTableRef.value && (comTableRef.value.total = res.data.data.total);
  } catch (e) { }
}
</script>

<style lang="scss" scoped>
.role_wrapper {
  height: 100%;
}
</style>