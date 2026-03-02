<template>
  <div>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="permissionName" label="权限名" show-overflow-tooltip :width="layoutStore.isMobile ? 100 : undefined"></el-table-column>
      <el-table-column prop="permissionCode" label="权限码" align="center" :width="layoutStore.isMobile ? 100 : undefined">
        <template #default="scope">
          <el-tag :type="getTag(scope.row.permissionCode)">{{ scope.row.permissionCode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"
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
import type { SysPermission } from '@/types/modules/perm';
import { getPerms } from '@/api/system/perm';
import dayjs from 'dayjs';
import { useLayoutStore } from '@/store/layout';


const layoutStore = useLayoutStore();

const pageNum = ref(1);
const pageSize = ref(10);

const users = ref<SysPermission[]>([]);
const total = ref(0);

const loadTableData = async () => {
  try {
    const res = await getPerms({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    users.value = res.data.data.records;
    total.value = res.data.data.total;
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