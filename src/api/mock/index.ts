import type { AxiosRequestConfig, AxiosAdapter } from 'axios';

const modulesFiles = import.meta.glob('./modules/*.ts', { eager: true });

const allModules: { [key: string]: any }[] = [];

Object.keys(modulesFiles).forEach(modulePath => {
  const module = modulesFiles[modulePath] as { default: any };
  allModules.push(module.default);
});

// 最终集中对象
const mockObj: { [key: string]: any } = new Proxy({}, {
  get(target, prop, receiver) {
    // 先看 target 自己的属性
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }

    // 遍历所有模块的 Proxy
    for (const moduleProxy of allModules) {
      if (prop in moduleProxy || typeof moduleProxy === 'object') {
        // 注意：直接访问 moduleProxy[prop] 会触发各自 Proxy 的 get 拦截
        const val = moduleProxy[prop as string];
        if (val !== undefined) {
          return val;
        }
      }
    }

    // 找不到就返回 undefined
    return undefined;
  }
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