<template>
  <div class="files_wrapper">

    <el-table :data="files">
      <el-table-column prop="originalName" label="文件名" show-overflow-tooltip />
      <el-table-column prop="fileSize" label="大小" align="center"
        :formatter="(_: any, __: any, cell: string) => formatBytes(cell)" />
      <el-table-column prop="createTime" label="上传时间" align="center"
        :formatter="(_: any, __: any, cell: any) => dayjs(cell).format('YYYY-MM-DD hh:mm:ss')" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="handleDownload(row.id)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
// 工具
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { formatBytes, downloadFile } from '@/utils';

// 数据
import { getFiles, downloadFileById } from '@/api/system/file';

// ----------------- 加载文件列表 start -----------------
const files = ref([]);
const loadTableData = async () => {
  const res = await getFiles();
  files.value = res.data;
}
onMounted(() => {
  loadTableData();
});
// ----------------- 加载文件列表 end -------------------



// ----------------- 下载文件 start -----------------
const getFilenameFromHeader = (disposition?: string) => {
  if (!disposition) return 'download'
  const match = disposition.match(/filename\*=UTF-8''(.+)|filename="(.+)"/)
  return decodeURIComponent(match?.[1] || match?.[2] || 'download')
}

const handleDownload = async (fileId: string) => {
  try {
    const res = await downloadFileById(fileId);
    const disposition = res.headers['content-disposition'];
    const filename = getFilenameFromHeader(disposition);
    downloadFile(res.data, filename);
  } catch (e) {
    console.log(e);
  }
}
// ----------------- 下载文件 end -------------------
</script>
