<template>
  <el-upload
    action=""
    :http-request="handleUpload"
    :show-file-list="false"
  >
    <el-button type="primary">上传文件</el-button>
  </el-upload>

  <el-table :data="files" style="margin-top: 20px">
    <el-table-column prop="originalName" label="文件名" />
    <el-table-column prop="fileSize" label="大小" />
    <el-table-column prop="createTime" label="上传时间" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button size="small" @click="download(row.id)">下载</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface FileItem {
  id: number
  originalName: string
  fileSize: number
  createTime: string
}

const files = ref<FileItem[]>([])

onMounted(() => {
  files.value = [
    {
      id: 1,
      originalName: 'test.png',
      fileSize: 102400,
      createTime: '2026-01-06'
    }
  ]
})

const handleUpload = () => {
  console.log('upload')
}

const download = (id: number) => {
  console.log('download', id)
}
</script>
