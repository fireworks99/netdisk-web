# 网盘项目-前端

> Vue 3 + Vue Router + Pinia + TypeScript + Vite + Element Pus



## 基础功能

- [ ] 文件的查询、上传、下载、删除、预览、移动位置
- [ ] 文件夹的查询、创建、删除、移动位置
- [ ] 区分用户、角色、权限，不同的权限分配给不同的角色，不同的角色分配给不同的用户
- [ ] 大文件切片/分块上传，采用流式数据来给前端发送上传或下载的速度
- [ ] 上传、下载实现断点续传
- [x] 前端通过mock可独立于后端运行



* 首页 - 看板
* 我的网盘
  * 我的文件
    * 文件查询、上传、下载、删除、预览、移动位置
    * 文件夹查询、创建、删除、移动位置
  * 我的收藏
    * 文件收藏
  * 最近访问
    * 文件上传、下载、预览
  * 回收站
    * 文件删除
* 用户中心
  * 个人信息
  * 安全设置
* 系统管理
  * 用户管理
  * 角色管理
  * 权限管理



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
    * 监听路由变化，如果是移动端，则在路由变化后关闭Sidebar
  
* 2026-01-14
  * 前端调用后端接口
    * 添加config.json(运行时配置)并在启动前加载
    * window.APP_CONFIG做类型声明
    * 封装axios实例，定义请求拦截器（mock数据）、响应拦截器（统一错误处理）
  
* 2026-01-15
  * 对接文件下载接口
  
  * 对接文件上传接口
  
  * docker拉取minio镜像，为下一步做准备
  
    ~~~bash
    docker run -d \
      --name minio \
      -p 9000:9000 \
      -p 9001:9001 \
      -e MINIO_ROOT_USER=minioadmin \
      -e MINIO_ROOT_PASSWORD=minioadmin \
      -v D:/minio/data:/data \
      minio/minio server /data --console-address ":9001"
    ~~~
  
* 2026-01-30
  * 修改前端上传逻辑：先从后端拿到minio的预签名url，再直传minio
  * 对接minio模式下的查询、上传、下载接口
  
* 2026-02-01

  * 编写文件预览——图片采用Fancybox
  * 引入@vue-office，实现 pptx / docx / xlsx / pdf 预览
  
* 2026-02-02

  * 引入@kangc/v-md-editor，实现Markdown文件预览
  * 利用highlight.js实现code类文件预览
  * 引入video.js实现视频预览
  * 利用原生audio标签实现音频预览
