<template>
  <el-card style="max-width: 500px; margin: 40px auto;">
    <template #header>
      <span>个人信息</span>
    </template>

    <el-descriptions :column="1" border label-width="80">
      <el-descriptions-item label="用户标识">
        {{ userId }}
      </el-descriptions-item>
      <el-descriptions-item label="用户名">
        {{ username }}
      </el-descriptions-item>
      <el-descriptions-item label="Token">
        <span class="token">{{ token }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="过期时间">
        {{ dayjs(tokenExp).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';

const userId = ref(localStorage.getItem('userId'));
const username = ref(localStorage.getItem('username'));
const token = ref(localStorage.getItem('token'));
const tokenExp = ref(localStorage.getItem('token_exp'));
</script>

<style scoped>
.token {
  word-break: break-all;
  font-size: 12px;
  color: #666;
}
</style>

<style>
.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  text-align: center;
}
</style>