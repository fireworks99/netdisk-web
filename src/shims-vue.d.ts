// TypeScript 找不到 Vue 文件的类型声明文件

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}