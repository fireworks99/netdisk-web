<template>
  <div>
    <el-table :data="files" style="width: 100%">
      <el-table-column prop="name" label="文件名" show-overflow-tooltip>
        <template #default="scope">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img :src="getIconUrl(scope.row)" alt="icon" style="width: 18px; height: 18px;" />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="大小" align="center"
        :formatter="(_: any, __: any, cell: string) => formatBytes(cell)" />
      <el-table-column prop="createTime" label="上传时间" align="center" v-if="!layoutStore.isMobile"
        :formatter="(_: any, __: any, cell: any) => dayjs(cell).format('YYYY-MM-DD HH:mm:ss')" />
      <el-table-column label="操作" align="center" width="188">
        <template #default="{ row }">
          <div class="table-operations">
            <el-button size="small" @click="restoreF(row)">恢复</el-button>
            <el-button size="small" type="danger" @click="deleteF(row)">彻底删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex_center" style="margin-top: 16px;">
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" size="small"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { restore, deleteForever } from '@/api/system/disk';
import type { DiskItem } from '@/types';
import dayjs from 'dayjs';
import { formatBytes } from '@/utils';
import { useFileSystem } from '@/composables/useFileSystem';

const {
  // 文件列表
  loadIcons,
  getIconUrl,
  deleted,
  pageNum,
  pageSize,
  files,
  total,
  loadTableData,
  handleCurrentChange,
  handleSizeChange,

  // 行点击
  layoutStore,
} = useFileSystem();

onMounted(() => {
  deleted.value = true;
  loadIcons();
  loadTableData();
});

const restoreF = async (row: DiskItem) => {
  try {
    await restore(row.id);
    ElMessage({
      type: 'success',
      message: '恢复成功',
    });
    loadTableData();
  } catch (e) {
    console.log(e);
  }
}

import { ElMessageBox, ElMessage } from 'element-plus';
const deleteF = async (row: DiskItem) => {
  ElMessageBox.confirm(
    `确认彻底删除 ${row.name} 吗？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteForever(row.id);
      loadTableData();
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '未删除',
      });
    });
}
</script>