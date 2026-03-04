<template>
  <el-card style="max-width: 500px; margin: 40px auto;">
    <template #header>
      <span>安全设置</span>
    </template>

    <el-descriptions :column="1" border label-class-name="center-label">
      <el-descriptions-item label="修改密码">
        <el-button type="primary" size="small" @click="changePassword">修改</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="两步验证">
        <el-switch v-model="twoFactor" active-color="#13ce66"></el-switch>
      </el-descriptions-item>

      <el-descriptions-item label="最近登录设备">
        <ul style="padding-left: 20px; margin: 0;">
          <li v-for="(device, index) in devices" :key="index">{{ device }}</li>
        </ul>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const twoFactor = ref(false)
const devices = ref(['Chrome - Windows 10', 'Firefox - macOS', 'iPhone App'])

function changePassword() {
  
}
</script>

<style scoped>
.center-label {
  text-align: center !important;
}
</style>