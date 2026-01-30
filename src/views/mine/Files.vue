<template>
  <div class="files_wrapper">

    <div class="flex_bet" style="margin-bottom: 16px;">
      <el-button type="primary" icon="Plus" @click="dialogVisible = true">上传文件</el-button>
      <el-button icon="Plus">新建文件夹</el-button>
    </div>

    <el-table :data="files">
      <el-table-column prop="originalName" label="文件名" show-overflow-tooltip />
      <el-table-column prop="fileSize" label="大小" align="center"
        :formatter="(_: any, __: any, cell: string) => formatBytes(cell)" />
      <el-table-column prop="createTime" label="上传时间" align="center"
        :formatter="(_: any, __: any, cell: any) => dayjs(cell).format('YYYY-MM-DD hh:mm:ss')" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="handleDownload(row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="文件上传" width="460">

      <!-- 上传区域 -->
      <el-upload ref="upload" drag action="" :limit="1" :on-exceed="handleExceed" :auto-upload="false"
        @change="handleFileChange">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            单次只能上传一个文件
          </div>
        </template>
      </el-upload>

      <!-- 上传按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpload">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 工具
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { formatBytes, downloadMinIOFile } from '@/utils';
import { ElMessage, genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';

// 数据
import axios from 'axios';
import { getFiles, downloadFileById, getUploadInfo, saveData } from '@/api/system/file';

// ----------------- 加载文件列表 start -----------------
const files = ref([]);
const loadTableData = async () => {
  const res = await getFiles();
  files.value = res.data.data;
}
onMounted(() => {
  loadTableData();
});
// ----------------- 加载文件列表 end -------------------



// ----------------- 下载文件 start -----------------
const handleDownload = async (row: { id: number, originalName: string }) => {
  try {
    const res = await downloadFileById(row.id);
    
    downloadMinIOFile(res.data.data, row.originalName);
  } catch (e) {
    console.log(e);
  }
}
// ----------------- 下载文件 end -------------------



// ----------------- 上传文件 start -----------------
const dialogVisible = ref(false);

const upload = ref<UploadInstance>();

let selectedFile: UploadRawFile | null = null;

const handleFileChange: UploadProps['onChange'] = (file) => {
  selectedFile = file.raw || null;
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
}

const handleUpload = async () => {
  if (!selectedFile) {
    ElMessage.warning('请先选择要上传的文件');
    return;
  }

  try {
    const result = await getUploadInfo({
      "originalName": selectedFile.name,
      "contentType": selectedFile.type,
      "size": selectedFile.size
    });

    const { objectName, uploadUrl } = result.data.data;

    const putRes = await axios.put(uploadUrl, selectedFile, {
      headers: {
        'Content-Type': selectedFile.type
      },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded / e.total!) * 100)
        console.log('上传进度:', percent)
      }
    });

    
    const etag = putRes.headers['etag']?.replace(/"/g, '');

    await saveData({
      "originalName": selectedFile.name,
      "bucketName": window.APP_CONFIG.BUCKET,
      "objectKey": objectName,
      "fileSize": selectedFile.size,
      "contentType": selectedFile.type,
      "fileExt": selectedFile.name.split('.').pop(),
      "uploaderId": 1,
      etag,
      "isPublic": false,
    });

    // 失败会抛出异常，不会执行到这里
    dialogVisible.value = false;
    upload.value?.clearFiles();
    selectedFile = null;
    await loadTableData();
  } catch (error) {
    console.error('文件上传失败:', error);
  }
}
// ----------------- 上传文件 end -------------------
</script>
