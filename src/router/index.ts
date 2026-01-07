import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/files'
  },
  {
    path: '/files',
    component: () => import("@/views/FileList.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
