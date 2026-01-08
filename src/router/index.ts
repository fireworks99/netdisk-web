import { createRouter, createWebHistory } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'

const routes = [
  {
    path: '/',
    meta: { title: '首页', icon: Icons['HomeFilled'], hidden: true },
    component: () => import("@/views/Overview.vue")
  },
  {
    path: '/mine',
    meta: { title: '我的网盘', icon: Icons['Folder'] },
    children: [
      {
        path: 'files',
        meta: { title: '我的文件', icon: Icons['Document'] },
        component: () => import("@/views/mine/Files.vue")
      },
      {
        path: 'favorites',
        meta: { title: '我的收藏', icon: Icons['Star'] },
        component: () => import("@/views/mine/Favorites.vue")
      },
      {
        path: 'recent',
        meta: { title: '最近访问', icon: Icons['Clock'] },
        component: () => import("@/views/mine/Recent.vue")
      },
      {
        path: 'recycle',
        meta: { title: '回收站', icon: Icons['Delete'] },
        component: () => import("@/views/mine/Recycle.vue")
      }
    ]
  },
  {
    path: '/user',
    meta: { title: '用户中心', icon: Icons['User'] },
    children: [
      {
        path: 'profile',
        meta: { title: '个人信息', icon: Icons['Tickets'] },
        component: () => import("@/views/user/Profile.vue")
      },
      {
        path: 'security',
        meta: { title: '安全设置', icon: Icons['Lock'] },
        component: () => import("@/views/user/Security.vue")
      },
    ]
  },
  {
    path: '/sys',
    meta: { title: '系统管理', icon: Icons['Tools'] },
    children: [
      {
        path: 'users',
        meta: { title: '用户管理', icon: Icons['UserFilled'] },
        component: () => import("@/views/sys/Users.vue")
      },
      {
        path: 'roles',
        meta: { title: '角色管理', icon: Icons['Avatar'] },
        component: () => import("@/views/sys/Roles.vue")
      },
      {
        path: 'permissions',
        meta: { title: '权限管理', icon: Icons['Key'] },
        component: () => import("@/views/sys/Permission.vue")
      }
    ]
  },
]

export { routes }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
