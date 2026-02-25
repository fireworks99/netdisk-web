<template>
  <div class="files_wrapper">

    <!-- 1. 上传文件与新建文件夹 -->
    <div class="bc">
      <Breadcrumb :breadcrumb-list="breadcrumbList" sepa="/" :clickable="true" @menu-click="cdUp" />
      <div v-show="multi.length > 0">
        <el-button @click="batchDownload">批量下载</el-button>
        <el-button @click="batchMove">批量移动</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </div>
    </div>

    <div class="header">
      <div class="flex_center">
        <el-input v-model="keyword" placeholder="输入文件名称" clearable @clear="loadTableData"
          @keyup.enter.active="loadTableData">
          <template #append>
            <el-button icon="Search" @click="loadTableData" />
          </template>
        </el-input>
      </div>
      <div>
        <el-button icon="Back" @click="cdUp" v-show="path.length > 1">返回</el-button>
        <el-button type="primary" icon="Plus" @click="dialogVisible = true">上传文件</el-button>
        <el-button icon="Plus" @click="handleAddFolder">新建文件夹</el-button>
      </div>
    </div>


    <!-- 2. 文件陈列展示 -->
    <el-table :data="files" @[eventName]="handleRowClick"
      @selection-change="(val: any[]) => multi.splice(0, multi.length, ...val)">
      <el-table-column type="selection" width="28" />
      <el-table-column prop="name" label="文件名" show-overflow-tooltip>
        <template #default="scope">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img :src="getIconUrl(scope.row)" alt="icon" style="width: 18px; height: 18px;" />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="大小" align="center" v-if="!layoutStore.isMobile"
        :formatter="(_: any, __: any, cell: string) => formatBytes(cell)" />
      <el-table-column prop="createTime" label="上传时间" align="center" v-if="!layoutStore.isMobile"
        :formatter="(_: any, __: any, cell: any) => dayjs(cell).format('YYYY-MM-DD HH:mm:ss')" />
      <el-table-column label="操作" align="center" width="188">
        <template #default="{ row }">
          <div class="table-operations">
            <el-button size="small" @click.stop="handleDownload(row)" v-if="row.type === 'FILE'">下载</el-button>
            <el-button size="small" @click.stop="handlePreview(row)" v-if="row.type === 'FILE'">预览</el-button>
            <el-button size="small" @click.stop="handleMove(row)">移动</el-button>
            <el-button size="small" type="danger" @click.stop="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex_center" style="margin-top: 16px;">
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" size="small" />
    </div>

    <!-- 3. 上传文件对话框 -->
    <el-dialog v-model="dialogVisible" title="文件上传" width="460">

      <!-- 上传区域 -->
      <!-- <el-upload ref="upload" drag action="" :limit="1" :on-exceed="handleExceed" :auto-upload="false" @change="handleFileChange"> -->
      <el-upload ref="upload" drag action="" multiple :auto-upload="false" @change="handleFileChange">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            <!-- 单次只能上传一个文件 -->
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

    <!-- 4. 文件预览抽屉 -->
    <el-drawer v-model="previewing" :title="preName" size="70%" direction="btt">
      <Preview :url="preUrl" :ext="preExt" :name="preName" />
    </el-drawer>

    <!-- 5. 文件移动对话框 -->
    <MoveDest :cur-path="path" v-model:move-visiable="moveVisiable" :move-which="moveWhich" v-if="moveVisiable" />

  </div>
</template>

<script setup lang="ts">
// Vue核心
import { ref, onMounted, defineAsyncComponent, watch, reactive } from 'vue';

// 第三方库
import dayjs from 'dayjs';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';

// 自定义工具
import { formatBytes, downloadMinIOFile, downloadByBlob } from '@/utils';

// 自定义组件
import Breadcrumb from '@/components/Breadcrumb.vue';

// API
import {
  getBatchUploadInfo, batchSaveFileInfo, getPDUrl, addFolder, deleteF,
  batchDownloadAPI, batchDeleteAPI
} from '@/api/system/disk';

// 类型声明
import type { DiskItem } from '@/types';

// 组合式函数
import { useFileSystem } from '@/composables/useFileSystem';

const {
  path,
  parentId,
  multi,

  breadcrumbList,//面包屑

  cdUp,//返回上级

  // 文件列表
  loadIcons,
  getIconUrl,
  keyword,
  pageNum,
  pageSize,
  files,
  total,
  loadTableData,
  handleCurrentChange,
  handleSizeChange,

  // 行点击
  layoutStore,
  eventName,
  handleRowClick
} = useFileSystem();

onMounted(() => {
  loadIcons();
  loadTableData();
});



// ----------------- 下载文件 start -----------------
const handleDownload = async (row: DiskItem) => {
  try {
    const res = await getPDUrl(row.id);

    downloadMinIOFile(res.data.data, row.name);
  } catch (e) {
    console.log(e);
  }
}
// ----------------- 下载文件 end -------------------



// ----------------- 预览文件 start -----------------
const Preview = defineAsyncComponent(() =>
  import('@/components/Preview.vue')
);
const previewing = ref(false);
const preUrl = ref("");
const preExt = ref("");
const preName = ref("");
const handlePreview = async (row: DiskItem) => {
  preName.value = row.name;
  try {
    const res = await getPDUrl(row.id);
    preUrl.value = res.data.data;
    preExt.value = row.name.split('.').pop()?.toLowerCase() || "";
  } catch (e) {
    console.log(e);
  } finally {
    previewing.value = true;
  }
}
// ----------------- 预览文件 end -------------------



// ----------------- 上传文件 start -----------------
const dialogVisible = ref(false);

const upload = ref<UploadInstance>();

let selectedFiles: UploadRawFile[] = [];

const handleFileChange: UploadProps['onChange'] = (file) => {
  if (file.raw) {
    selectedFiles.push(file.raw);
  }
}

const handleUpload = async () => {
  if (!selectedFiles || selectedFiles.length === 0) {
    ElMessage.warning('请先选择要上传的文件');
    return;
  }

  try {
    const list: { originalName: string, contentType: string, size: number }[] = [];
    selectedFiles.forEach(f => {
      list.push({
        "originalName": f.name,
        "contentType": f.type,
        "size": f.size
      });
    });
    const result = await getBatchUploadInfo(list);

    const infoList = result.data.data;

    if (!window.APP_CONFIG.USE_MOCK) {
      const promiseList: Promise<any>[] = [];
      infoList.forEach((info: { uploadUrl: string }, index: number) => {
        promiseList.push(axios.put(info.uploadUrl, selectedFiles[index], {
          headers: {
            'Content-Type': selectedFiles[index]?.type
          },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded / e.total!) * 100)
            console.log('上传进度:', percent)
          }
        }))
      });
      Promise.all(promiseList).then(async results => {
        const list: {}[] = [];
        results.forEach((res, index) => {
          const etag = res.headers['etag']?.replace(/"/g, '');
          list.push({
            "name": selectedFiles[index]?.name,
            "parentId": parentId.value,
            "bucketName": window.APP_CONFIG.BUCKET,
            "objectKey": infoList[index].objectName,
            "fileSize": selectedFiles[index]?.size,
            "contentType": selectedFiles[index]?.type,
            "fileExt": selectedFiles[index]?.name.split('.').pop()?.toLowerCase(),
            etag,
          });
        });

        await batchSaveFileInfo(list);

        // 失败会抛出异常，不会执行到这里
        ElMessage.success("文件上传成功");
        dialogVisible.value = false;
        upload.value?.clearFiles();
        selectedFiles = [];
        await loadTableData();
      }).catch(error => {
        console.log('上传失败: ', error);
      });
    }

  } catch (error) {
    console.error('文件上传失败:', error);
  }
}
// ----------------- 上传文件 end -------------------



// ----------------- 创建文件夹 start -----------------
import { ElMessageBox } from 'element-plus';

const handleAddFolder = () => {

  ElMessageBox.prompt('输入文件夹名称', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^[^\\/:*?"<>|]+$/,
    inputErrorMessage: '无效名称',
  })
    .then(async ({ value }) => {
      await addFolder({ name: value.trim(), parentId: parentId.value });
      await loadTableData();
      ElMessage.success("文件夹创建成功");
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消创建',
      });
    });
}
// ----------------- 创建文件夹 end -----------------



// ----------------- 移动文件（夹）start -----------------
const MoveDest = defineAsyncComponent(() =>
  import('@/components/MoveDest.vue')
);
const moveVisiable = ref(false);
const moveWhich = reactive<any[]>([]);
const handleMove = async (row: DiskItem) => {
  moveVisiable.value = true;
  moveWhich.splice(0, moveWhich.length, row);
};
watch(
  () => moveVisiable.value,
  val => {
    !val && (loadTableData());
  }
)
// ----------------- 移动文件（夹）end -------------------



// ----------------- 删除文件（夹）start -----------------
const handleDelete = async (row: DiskItem) => {
  ElMessageBox.confirm(
    `确认删除 ${row.name} 吗？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteF(row.id);
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
    })
}
// ----------------- 删除文件（夹）end -------------------



// ----------------- 批量下载 start -----------------
const batchDownload = async () => {
  try {
    const res = await batchDownloadAPI({
      itemIds: multi.map(item => item.id)
    });
    const disposition = res.headers['content-disposition'];
    let fileName = 'download.zip';

    if (disposition) {
      const match = disposition.match(/filename="?(.+)"?/);
      if (match?.[1]) {
        fileName = decodeURIComponent(match[1]);
      }
    }
    const blob = new Blob([res.data], {
      type: 'application/zip'
    });
    downloadByBlob(blob, fileName);

  } catch (e) {
    console.log("批量下载失败", e);
  }
}
// ----------------- 批量下载 end -------------------



// ----------------- 批量移动 start -----------------
const batchMove = () => {
  moveVisiable.value = true;
  moveWhich.splice(0, moveWhich.length, ...multi);
}
// ----------------- 批量移动 end -------------------



// ----------------- 批量删除 start -----------------
const batchDelete = () => {
  ElMessageBox.confirm(
    `确认删除所选文件（夹）吗？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await batchDeleteAPI({
        itemIds: multi.map(item => item.id)
      });
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
// ----------------- 批量删除 end -------------------
</script>

<style lang="scss" scoped>
.files_wrapper {

  .bc,
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    margin-bottom: 16px;
  }
}

#app.mobile {
  .files_wrapper {

    .bc,
    .header {
      flex-direction: column;
    }
  }
}
</style>