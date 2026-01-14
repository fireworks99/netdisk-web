<template>
  <div class="files_wrapper">

    <el-table :data="files" >
      <el-table-column prop="originalName" label="文件名" />
      <el-table-column prop="fileSize" label="大小" />
      <el-table-column prop="createTime" label="上传时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="console.log(row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUsers } from '@/api/system/file';

const files = ref([]);
const loadTableData = async () => {
  const res = await getUsers();
  files.value = res.data;
}


onMounted(() => {
  loadTableData();
});

</script>
