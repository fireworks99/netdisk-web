<template>
  <div class="user_wrapper">

    <ComTable ref="comTableRef" :real-data="users" @refresh="loadTableData">

      <!-- 1. 查询条件 -->
      <template #conditions></template>

      <!-- 2. 按钮组 -->
      <template #ops></template>

      <!-- 3. 表格列 -->
      <template #columns>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip
          :width="layoutStore.isMobile ? 100 : undefined"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" :width="layoutStore.isMobile ? 70 : undefined">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"
          :formatter="(_: any, __: any, c: any) => dayjs(c).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" v-if="!layoutStore.isMobile"
          :formatter="(_: any, __: any, c: any) => dayjs(c).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
      </template>

    </ComTable>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SysUser } from '@/types/modules/user';
import { getUsers } from '@/api/system/user';
import dayjs from 'dayjs';
import { useLayoutStore } from '@/store/layout';
import ComTable from '@/components/ComTable.vue';

const layoutStore = useLayoutStore();

const users = ref<SysUser[]>([]);
const comTableRef = ref<InstanceType<typeof ComTable> | null>(null);

const loadTableData = async () => {
  try {
    const res = await getUsers({
      pageNum: comTableRef?.value?.currentPage,
      pageSize: comTableRef?.value?.pageSize
    });
    users.value = res.data.data.records;
    comTableRef.value && (comTableRef.value.total = res.data.data.total);
  } catch (e) { }
}
</script>

<style lang="scss" scoped>
.user_wrapper {
  height: 100%;
}
</style>