import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 中文语言包
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { getCurrent } from '@/api/system/user.ts'
import { useUserStore } from '@/store/user';

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIcons)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

try {
  const res = await getCurrent()
  const info = res.data.data
  const user = useUserStore()
  user.setUserInfo(info)
} catch (e) {
  console.log(e)
}

app.mount('#app')
