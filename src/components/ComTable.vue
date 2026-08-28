<template>
  <div class="table_wrapper">

    <!-- 1. 查询条件 -->
    <div class="filter_wrapper" v-if="queryParams && Object.keys(queryParams).length > 0">
      <el-form :model="queryParams" ref="queryFormRef" size="small" :inline="true" @submit.native.prevent>

        <!-- 1.1 所有条件 -->
        <slot name="conditions" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="specialQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

          <!-- 1.2 其他按钮 -->
          <slot name="querybtns" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 2. 操作按钮 -->
    <div class="btn_wrapper">
      <el-row :gutter="10">
        <slot name="ops" />
      </el-row>
    </div>


    <div class="table_page_wrapper">
      <!-- 3. 数据表格 -->
      <el-table :data="realData" stripe style="width: 100%;" height="calc(100% - 48px)" v-loading="loading"
        highlight-current-row :border="border" @current-change="handleSelectChange"
        @selection-change="handleSelectionChange" v-show="realData.length >= 10">
        <slot name="columns" />
      </el-table>

      <el-table :data="realData" stripe style="width: 100%;" v-loading="loading" v-show="realData.length < 10"
        highlight-current-row :border="border" @current-change="handleSelectChange" @selection-change="handleSelectionChange">
        <slot name="columns" />
      </el-table>

      <!-- 4. 分页组件 -->
      <div class="paging flex_center">
        <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handlePageChange" />
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';

const props = defineProps({
  // 单选
  single: {
    type: Object,
    default: null
  },
  // 多选
  multi: {
    type: Array,
    default: () => []
  },
  queryParams: {
    type: Object,
    default: () => ({})
  },
  realData: {
    type: Array,
    default: () => []
  },
  border: {
    type: Boolean,
    default: true
  },
  firstLoadByHand: {
    type: Boolean,
    default: false
  }
});

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'update:single', value: Object): void
  (e: 'update:multi', value: Array<Object>): void
}>();

//------------------ 1. 查询条件 ------------------
const specialQuery = () => {
  currentPage.value = 1;
  handleQuery();
}

// 定义 ref，类型为 Element Plus 的 Form 实例或 null
const queryFormRef = ref<FormInstance | null>(null);
const resetQuery = () => {
  queryFormRef?.value?.resetFields();
}

const handleQuery = () => {
  emit('refresh');
}


//------------------ 3. 数据表格 ------------------
const loading = ref(false);

const handleSelectChange = (val: Object) => {
  emit('update:single', val);
}

const handleSelectionChange = (val: Array<Object>) => {
  emit('update:multi', val);
}


//------------------ 4. 分页组件 ------------------
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  handleQuery();
}

const handlePageChange = (val: number) => {
  currentPage.value = val;
  handleQuery();
}


// ------------------ 初始化 ------------------
onMounted(() => {
  !props.firstLoadByHand && handleQuery();
});


// 必须通过 defineExpose 暴露才能被父组件访问
defineExpose({
  currentPage,
  pageSize,
  total,
  specialQuery,
  resetQuery,
  handleQuery
});
</script>

<style lang="scss" scoped>
.table_wrapper {
  height: 100%;

  .btn_wrapper {
    margin-bottom: 8px;
  }

  .table_page_wrapper {
    height: 100%;
    max-height: calc(50px * 11 + 48px - 1px);

    .paging {
      height: 48px;
    }
  }
}
</style>