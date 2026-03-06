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
      <el-descriptions-item label="角色">
        <div class="tags-container">
          <div v-for="item in roles" :key="item">
            <el-tag :type="item === 'ROLE_ADMIN' ? 'success' : 'primary'">{{ item }}</el-tag>
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="权限">
        <div class="tags-container">
          <div v-for="item in perms" :key="item">
            <el-tag :type="getTag(item)">{{ item }}</el-tag>
          </div>
        </div>
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

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';

const userId = ref(localStorage.getItem('userId'));
const username = ref(localStorage.getItem('username'));
const token = ref(localStorage.getItem('token'));
const tokenExp = ref(localStorage.getItem('token_exp'));

const rArr = (localStorage.getItem('roles') || '').split(',');
const roles = ref(rArr);

const pArr = (localStorage.getItem('perms') || '').split(',');
const perms = ref(pArr);


const getTag = (code: string) => {
  const obj = {
    add: 'primary',
    view: 'success',
    update: 'warning',
    delete: 'danger',
    other: 'info'
  };

  const text = code.split(':').pop();

  if (text && text in obj) {
    return obj[text as keyof typeof obj];
  }

  return obj.other;
}
</script>

<style scoped>
.token {
  word-break: break-all;
  font-size: 12px;
  color: #666;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;  /* gap 同时控制水平和垂直间距 */
}
</style>

<style>
.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  text-align: center;
}
</style>