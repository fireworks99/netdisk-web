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
import { getRecent } from '@/api/system/recent';

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
  loadRecentData();
});

const loadRecentData = async () => {
  try {
    const res = await getRecent({ pageNum: pageNum.value, pageSize: pageSize.value });
    files.value = res.data.data.records;
    total.value = res.data.data.total;
  } catch (e) {
    console.log(e);
  }
}

</script>