<template>
  <div>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" label="用户名" show-overflow-tooltip :width="layoutStore.isMobile ? 100 : undefined"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" :width="layoutStore.isMobile ? 70 : undefined">
        <template #default="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"
        :formatter="(_: any, __: any, c: any) => dayjs(c).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" v-if="!layoutStore.isMobile"
        :formatter="(_: any, __: any, c: any) => dayjs(c).format('YYYY-MM-DD HH:mm:ss')"></el-table-column>
    </el-table>

    <div class="flex_center" style="margin-top: 16px;">
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" size="small" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { SysUser } from '@/types/modules/user';
import { getUsers } from '@/api/system/user';
import dayjs from 'dayjs';
import { useLayoutStore } from '@/store/layout';


const layoutStore = useLayoutStore();

const pageNum = ref(1);
const pageSize = ref(10);

const users = ref<SysUser[]>([]);
const total = ref(0);

const loadTableData = async () => {
  try {
    const res = await getUsers({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    users.value = res.data.data.records;
    total.value = res.data.data.total;
  } catch (e) { }
}

const handleCurrentChange = () => {
  loadTableData();
};

const handleSizeChange = () => {
  pageNum.value = 1;
  loadTableData();
};

onMounted(() => {
  loadTableData();
})

</script>