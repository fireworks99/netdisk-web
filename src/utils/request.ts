import axios from "axios";
import mockAdapter from '@/api/mock';
import { ElMessage, ElNotification } from 'element-plus';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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
  }

  return config;
}, error => {
  console.log('请求拦截器: ', error);
  Promise.reject(error);
})

const errorCode: Record<number | 'default', string>  = {
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
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = res.data.msg || errorCode[code] || errorCode['default'];
    
    
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }
    //未认证，跳转登录
    if (code === 401) {
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      ElNotification.error({ title: msg });
      return Promise.reject('error');
    } else {
      return res.data;
    }
  },
  error => {
    console.log('响应拦截器: ' + error);
    let { message } = error;
    
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.slice(-3) + "异常";
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 });
    return Promise.reject(error);
  }
);

export default service;