import type { AxiosRequestConfig, AxiosAdapter } from 'axios';

const modulesFiles = import.meta.glob('./modules/*.ts', { eager: true });

const mockObj: { [key: string]: any } = {};
Object.keys(modulesFiles).forEach(modulePath => {
  const module = modulesFiles[modulePath] as { default: any };
  Object.assign(mockObj, module.default);
});

const mockAdapter: AxiosAdapter = (config: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { url, method, params, data } = config;
      console.log(url, method, params, data);
      
      // 返回标准的axios响应格式
      resolve({
        data: mockObj[url as string],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config as any,// 使用类型断言，因为 AxiosResponse 期望更具体的类型
        request: {}
      });
    }, 300); // 300ms延迟，更真实
  })
}

export default mockAdapter;