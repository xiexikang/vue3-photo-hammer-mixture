import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import './index.css'
//ui框架 Vant3.x
import Vant from 'vant';
import 'vant/lib/index.css';
//移动端 rem适配
import './utils/mobileRem'

const app = createApp(App)
app
  .use(router)
  .use(Vant)

app.mount('#app')
