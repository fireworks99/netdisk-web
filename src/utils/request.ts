import axios from "axios";
import mockAdapter from '@/api/mock';
import { ElMessage, ElNotification } from 'element-plus';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import router from "@/router";

// 扩展 axios 配置类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    // 原始适配器
    __originalAdapter?: AxiosRequestConfig['adapter'];
    // 其他自定义属性...
  }

  export interface AxiosResponse {
    // mock 数据标记
    __isMock?: boolean;
  }
}

// 扩展内部请求配置类型（用于拦截器）
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  __originalAdapter?: AxiosRequestConfig['adapter'];
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
  baseURL: window.APP_CONFIG.BASE_API,
  timeout: 0
})

// 请求拦截器
service.interceptors.request.use(config => {
  const customConfig = config as CustomInternalAxiosRequestConfig;

  if (window.APP_CONFIG.USE_MOCK) {
    // 保存原始适配器
    config.__originalAdapter = customConfig.adapter || service.defaults.adapter;

    // 替换为mock适配器
    customConfig.adapter = mockAdapter;
  } else {
    const token = localStorage.getItem('token');
    if (token && router.currentRoute.value.path !== "/lr") {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
}, error => {
  console.log('请求拦截器: ', error);
  Promise.reject(error);
})

const errorCode: Record<number | 'default', string> = {
  401: '认证失败，无法访问系统资源',
  403: '当前操作没有权限',
  404: '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
};
// 响应拦截器
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // 如果是mock数据，做个标记（用于区分）
    if (res.config.adapter === mockAdapter) {
      res.__isMock = true;
    }

    // 未设置状态码则默认成功状态
    const code = res.data && res.data.code || 200;
    // 获取错误信息
    const msg = res.data.msg || errorCode[code] || errorCode['default'];


    // 二进制数据(保留headers)
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res;
    }

    if (code === 500) {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      ElNotification.error({ title: msg });
      /**
       * 直接想法是抛出异常，但是async函数中无法使用throw，因为需要返回Promise
       * 所以这里干脆直接使用Promise.reject来代替throw
       */
      return Promise.reject('code !== 200: ' + msg);
    } else {
      return res;
    }
  },
  error => {
    console.log('响应拦截器:', error);

    const status = error.response?.status;
    let message = error.message;

    if (message === "Network Error") {
      message = "网络错误";

      if (router.currentRoute.value.path !== "/lr") {
        router.replace('/lr').catch(() => { });
      }

    } else if (status === 401) {

      message = "未登录或登录已过期";

      localStorage.removeItem("token");
      localStorage.removeItem("token_exp");

      if (router.currentRoute.value.path !== "/lr") {
        router.replace('/lr').catch(() => { });
      }

    } else if (status === 403) {

      message = "当前操作没有权限";

    } else if (message.includes("timeout")) {

      message = "系统接口请求超时";

    } else if (status) {

      message = `系统接口 ${status} 异常`;
    }

    ElMessage({
      message,
      type: 'error',
      duration: 5000
    });

    return Promise.reject(error);
  }
);

export default service;