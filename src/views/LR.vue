<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      <el-input v-model="username" placeholder="用户名" class="mt-12"></el-input>
      <el-input v-model="password" placeholder="密码" type="password" class="mt-12" show-password
        @keyup.enter.native="handleLR"></el-input>
      <button @click="handleLR" class="mt-12" :disabled="loading">
        <span v-if="!loading">{{ isLogin ? '登录' : '注册' }}</span>
        <span v-else>
          <i class="el-icon-loading"></i> {{ isLogin ? '登录' : '注册' }}中...
        </span>
      </button>
      <p class="link"><a @click="isLogin = !isLogin" style="cursor: pointer;">{{ isLogin ? '没有账号？去注册' : '已有账号？返回登录' }}</a></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { loginAPI, registerAPI } from '@/api/system/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'

const router = useRouter();

const isLogin = ref(true);
const username = ref("");
const password = ref("");
const loading = ref(false);

const handleLR = () => {
  isLogin.value ? handleLogin() : handleRegister();
}

const handleLogin = async() => {
  loading.value = true;
  try {
    const res = await loginAPI(username.value, password.value);
    loading.value = false;
    ElMessage.success("登录成功");

    const info = res.data.data;

    localStorage.setItem("userId", info.userId);
    localStorage.setItem("username", info.username);
    localStorage.setItem("token", info.token);
    localStorage.setItem("token_exp", info.expiration);

    router.push("/");
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
};

const handleRegister = async() => {
  loading.value = true;
  try {
    const res = await registerAPI(username.value, password.value);
    loading.value = false;

    if(res.data.code === 200) {
      ElMessage.success("注册成功");
    } else {
      ElMessage.error(res.data.msg || '注册失败');
    }
    

    isLogin.value = true;
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
};

</script>

<style lang="scss" scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  /* 背景渐变 + 模糊 */
  background: linear-gradient(135deg, #2b6cb0, #3182ce, #63b3ed);
  background-size: 400% 400%;
  animation: gradientMove 12s ease infinite;

  .auth-box {
    width: 380px;
    padding: 40px 30px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(6px);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    h2 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 22px;
      font-weight: 600;
      color: #2b6cb0;
    }

    /* 输入框美化 */
    .el-input {
      width: 100%;

      input {
        border-radius: 8px;
        padding: 12px;
        border: 1px solid #dcdfe6;
        transition: border 0.2s, box-shadow 0.2s;

        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 6px rgba(64, 158, 255, 0.3);
        }
      }
    }

    /* 按钮升级 */
    button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #409eff, #63b3ed);
      color: #fff;
      font-weight: bold;
      font-size: 15px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s;

      &:hover {
        background: linear-gradient(135deg, #3182ce, #2b6cb0);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    /* 底部链接 */
    .link {
      margin-top: 16px;
      text-align: center;
      font-size: 13px;
      color: #666;

      a {
        color: #2b6cb0;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
          color: #1a365d;
          text-decoration: underline;
        }
      }
    }

    .mt-12 {
      margin-top: 12px;
    }

  }
}

/* 背景动效 */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>

<style lang="scss">
.auth-box {
  .el-input__inner {
    color: #000;
  }
}
</style>