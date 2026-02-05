<template>
  <div class="files_wrapper">

    <!-- 1. 上传文件与新建文件夹 -->
    <div class="flex_bet" style="margin-bottom: 16px;">
      <div>
        <Breadcrumb :breadcrumb-list="breadcrumbList"/>
      </div>
      <div>
        <el-button type="primary" icon="Plus" @click="dialogVisible = true">上传文件</el-button>
        <el-button icon="Plus" @click="handleAddFolder">新建文件夹</el-button>
      </div>
    </div>

    <!-- 2. 文件陈列展示 -->
    <el-table :data="files" @row-dblclick="handleRowDoubleClick">
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
        :formatter="(_: any, __: any, cell: any) => dayjs(cell).format('YYYY-MM-DD hh:mm:ss')" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="handleDownload(row)" v-if="row.type === 'FILE'">下载</el-button>
          <el-button size="small" @click="handlePreview(row)" v-if="row.type === 'FILE'">预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 3. 上传文件对话框 -->
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

    <!-- 4. 文件预览抽屉 -->
    <el-drawer v-model="previewing" :title="preName" size="70%" direction="btt">
      <Preview :url="preUrl" :ext="preExt" :name="preName" />
    </el-drawer>

  </div>
</template>

<script setup lang="ts">
// Vue核心
import { ref, reactive, onMounted, defineAsyncComponent, computed } from 'vue';

// 第三方库
import dayjs from 'dayjs';
import axios from 'axios';
import { ElMessage, genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';

// 自定义工具
import { formatBytes, downloadMinIOFile } from '@/utils';

// 状态管理
import { useLayoutStore } from '@/store/layout';

// API
import { getList, getUploadInfo, saveFileInfo, getPDUrl, addFolder } from '@/api/system/disk';

// 类型声明
import type { DiskItem } from '@/types';


const path = reactive<DiskItem[]>([]);
const parentId = computed(() => {
  return path.length > 0 ? path[path.length - 1]?.id : undefined;
})


// ----------------- 加载文件列表 start -----------------
const iconMap = ref<Record<string, string>>({});

const icons = [
  'folder', 'file', 'pdf', 'docx', 'xlsx', 'pptx',
  'image', 'audio', 'video', 'md'
];

const loadIcons = async () => {
  for (const icon of icons) {
    const module = await import(`@/assets/images/icons/${icon}.svg?url`)
    iconMap.value[icon] = module.default
  }
};

onMounted(() => {
  loadIcons();
});

const getIconUrl = (row: DiskItem) => {
  const iconName = getFileIconName(row);
  return iconMap.value[iconName] || iconMap.value.file;
}

const getFileIconName = (row: DiskItem): string => {
  if (row.type === 'FOLDER') {
    return 'folder';
  }

  const extension = getFileExtension(row.name);
  const iconMap: Record<string, string> = {
    'pdf': 'pdf',
    'doc': 'docx',
    'docx': 'docx',
    'xls': 'xlsx',
    'xlsx': 'xlsx',
    'ppt': 'pptx',
    'pptx': 'pptx',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'svg': 'image',
    'mp3': 'audio',
    'mp4': 'video',
    'webm': 'video',
    'mov': 'video',
    'ogv': 'video',
    'md': 'md',
  };

  return iconMap[extension.toLowerCase()] || 'file';
}

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()! : '';
};

const layoutStore = useLayoutStore();
const files = ref([]);

const loadTableData = async () => {
  const res = await getList(parentId.value ? { parentId: parentId.value } : undefined);
  files.value = res.data.data;
}

onMounted(() => {
  loadTableData();
});
// ----------------- 加载文件列表 end -------------------



// ----------------- 双击行 start -----------------
const handleRowDoubleClick = (row: DiskItem, _: any, __: any) => {
  path.push(row);
  loadTableData();
}
// ----------------- 双击行 end -------------------



// -------------------------- 文件面包屑 start  ------------------------
import { Folder } from '@element-plus/icons-vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
const breadcrumbList = computed(() => {
  return path.map(item => ({
    path: item.name,
    icon: Folder,
    title: item.name
  }))
})
// -------------------------- 文件面包屑 end  ------------------------



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

    let putRes = { headers: { etag: '' } };

    !window.APP_CONFIG.USE_MOCK && (putRes = await axios.put(uploadUrl, selectedFile, {
      headers: {
        'Content-Type': selectedFile.type
      },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded / e.total!) * 100)
        console.log('上传进度:', percent)
      }
    }));

    const etag = putRes.headers['etag']?.replace(/"/g, '');

    await saveFileInfo({
      "name": selectedFile.name,
      "parentId": parentId.value,
      "bucketName": window.APP_CONFIG.BUCKET,
      "objectKey": objectName,
      "fileSize": selectedFile.size,
      "contentType": selectedFile.type,
      "fileExt": selectedFile.name.split('.').pop()?.toLowerCase(),
      etag,
    });

    // 失败会抛出异常，不会执行到这里
    ElMessage.success("文件上传成功");
    dialogVisible.value = false;
    upload.value?.clearFiles();
    selectedFile = null;
    await loadTableData();
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
</script>
