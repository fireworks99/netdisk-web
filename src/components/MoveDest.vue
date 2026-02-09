<template>
  <el-dialog v-model="dialogVisible" title="文件上传" width="460">
    <div class="move_wrapper">
      <div class="flex_bet">
        <Breadcrumb :breadcrumb-list="breadcrumbList" sepa="/" :clickable="true" @menu-click="cdUp" />
        <el-button icon="Back" @click="cdUp" v-show="path.length > 1" size="small"></el-button>
      </div>

      <el-table :data="files" @[eventName]="handleRowClick">
        <el-table-column prop="name" label="文件名" show-overflow-tooltip>
          <template #default="scope">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img :src="getIconUrl(scope.row)" alt="icon" style="width: 18px; height: 18px;" />
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMoveReally">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Breadcrumb from '@/components/Breadcrumb.vue';
import { useFileSystem } from '@/composables/useFileSystem';
import { onMounted, watch, ref } from 'vue';
import type { PropType } from 'vue';
import type { DiskItem } from '@/types';
import { ElMessage } from 'element-plus';
import { move } from '@/api/system/disk';

const props = defineProps({
  curPath: {
    type: Array as PropType<DiskItem[]>,
    required: true,
    default: () => []
  },
  moveVisiable: {
    type: Boolean,
    default: false
  },
  moveWhich: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:moveVisiable']);

const {
  path,

  breadcrumbList,//面包屑

  cdUp,//返回上级

  // 文件列表
  loadIcons,
  getIconUrl,
  files,
  loadTableData,

  // 行点击
  eventName,
  handleRowClick
} = useFileSystem();

onMounted(() => {
  loadIcons();
  loadTableData();
});

// el-dialog v-model不能直接绑props，因为组件的'X'会尝试直接改这个值
const dialogVisible = ref(props.moveVisiable);

watch(
  () => props.moveVisiable,
  val => {
    if(val) {
      path.splice(0, path.length, ...props.curPath);
      loadTableData();
    }
    dialogVisible.value = val;
  },
  { immediate: true }
);

watch(dialogVisible, (val) => {
  emit('update:moveVisiable', val)
});

const handleMoveReally = async() => {
  if(path.some(p => p.id === props.moveWhich.id)) {
    ElMessage.warning("不能选择当前文件夹及其子孙文件夹");
    return ;
  }
  if(path[path.length - 1]?.id === props.moveWhich.parentId 
    || (path.length === 1 && props.moveWhich.parentId === null)) {
    ElMessage.warning("当前文件（夹）就在这个位置，无需移动");
    return ;
  }

  try {
    await move({ id: props.moveWhich.id, parentId: path[path.length - 1]?.id });
    dialogVisible.value = false;
  } catch (e) {
    ElMessage.error('移动失败');
  }
}

</script>