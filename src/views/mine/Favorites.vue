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
            <el-button size="small" type="danger" @click="rmF(row)">取消收藏</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex_center" style="margin-top: 16px;">
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import dayjs from 'dayjs';
import { formatBytes } from '@/utils';
import { useFileSystem } from '@/composables/useFileSystem';
import { getFavorite, rmFavorite } from '@/api/system/favorite';

const {
  // 文件列表
  loadIcons,
  getIconUrl,
  pageNum,
  pageSize,
  files,
  total,
  handleCurrentChange,
  handleSizeChange,

  // 行点击
  layoutStore,
} = useFileSystem();

onMounted(() => {
  loadIcons();
  loadFavoriteData();
});

const loadFavoriteData = async () => {
  try {
    const res = await getFavorite({ pageNum: pageNum.value, pageSize: pageSize.value });
    files.value = res.data.data.records;
    total.value = res.data.data.total;
  } catch (e) {
    console.log(e);
  }
}

import type { DiskItem } from '@/types';
import { ElMessageBox, ElMessage } from 'element-plus';

const rmF = async (row: DiskItem) => {
  ElMessageBox.confirm(
    `确认取消收藏 ${row.name} 吗？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await rmFavorite(row.id);
      loadFavoriteData();
      ElMessage({
        type: 'success',
        message: '取消收藏成功',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '未取消收藏',
      });
    });
}
</script>