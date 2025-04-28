import { createApp } from 'vue'
import App from './App.vue'
import './style.css' // this includes Tailwind base styles
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
