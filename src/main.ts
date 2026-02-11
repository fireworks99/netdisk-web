import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 中文语言包
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'
import * as ElementPlusIcons from '@element-plus/icons-vue'

async function bootstrap() {
  const baseUrl = import.meta.env.BASE_URL
  const res = await fetch(`${baseUrl}config.json`)
  const config = await res.json()

  window.APP_CONFIG = config

  const app = createApp(App)

  for (const [key, component] of Object.entries(ElementPlusIcons)) {
    app.component(key, component)
  }

  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus, { locale: zhCn })

  app.mount('#app')
}

bootstrap()

