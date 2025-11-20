import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'

// 添加全局错误处理
window.addEventListener('error', (e) => {
  console.error('全局错误:', e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的Promise拒绝:', e.reason)
})

const app = createApp(App)

app.use(router)

// 添加路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

app.mount('#app') 
