<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { recycleList, restore, deleteForever } from '@/api/system/disk';
import type { DiskItem } from '@/types';
import dayjs from 'dayjs';
import { formatBytes } from '@/utils';
import { useLayoutStore } from '@/store/layout';

const layoutStore = useLayoutStore();

const iconMap = ref<Record<string, string>>({});

const icons = ['folder', 'file', 'pdf', 'docx', 'xlsx', 'pptx', 'image', 'audio', 'video', 'md'];

const loadIcons = async () => {
  for (const icon of icons) {
    const module = await import(`@/assets/images/icons/${icon}.svg?url`);
    iconMap.value[icon] = module.default;
  }
};

const getIconUrl = (row: DiskItem) => {
  const iconName = getFileIconName(row);
  return iconMap.value[iconName] || iconMap.value.file;
};

const getFileIconName = (row: DiskItem): string => {
  if (row.type === 'FOLDER') {
    return 'folder';
  }

  const extension = getFileExtension(row.name);
  const iconMap: Record<string, string> = {
    pdf: 'pdf', doc: 'docx', docx: 'docx', xls: 'xlsx', xlsx: 'xlsx', ppt: 'pptx',
    pptx: 'pptx', jpg: 'image', jpeg: 'image', png: 'image', svg: 'image', md: 'md',
    mp3: 'audio', mp4: 'video', webm: 'video', mov: 'video', ogv: 'video'
  };

  return iconMap[extension.toLowerCase()] || 'file';
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()! : '';
};

const files = ref<DiskItem[]>([]);

const loadTableData = async () => {
  try {
    const res = await recycleList();
    files.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
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