# 网盘项目

> Vue 3 + Vue Router + Pinia + TypeScript + Vite + Element Pus



## 基础功能







## 更新日志

* 2026-01-07

  * 项目初始化
    * Vue3 +  Vue Router + Pinia + TypeScript + Vite + Element Pus + Axios
  * Github Pages托管
    * base: '/netdisk-web/'
    * history: createWebHistory(import.meta.env.BASE_URL)
    * .github/workflows/deploy.yml
  * 构建基础布局（Sidebar + Header + Content）
    * 引入sass，定义变量，编写全局样式
    * 引入dayjs，处理日期时间
    * 全局支持variables.scss

* 2026-01-08

  * Sidebar由路由渲染
    * 引入@element-plus/icons-vue，全局注册图标并使用
    * @/router/index.ts里定义路由并导出
    * Sidebar导入路由并渲染
    * 引入el-scrollbar（灵活的滚动条）

* 2026-01-12

  * Sidebar可隐藏/显示

    * Pinia定义全局变量（sidebarCollapsed）来控制Sidebar的动态类（collapse）

    * collapse样式里将宽度设为0，以及部分地方text-overflow的处理

  * 页面刷新、页面的淡入淡出

    * vue中的transition组件配合router-view，修改当前所渲染组件的key值来完成刷新
    * 全局样式里编写淡入淡出效果

  * 面包屑组件

    * 从路由中取出路径，渲染在组件中

  * 移动端适配
    * 添加isMobile状态（方便组件v-if渲染），#app挂载mobile/pc类（单独写样式）
    * sidebarCollapsed改成sidebarOpened，方便抽屉的v-model直接绑定
