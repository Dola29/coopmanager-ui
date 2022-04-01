import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './interceptors/axios'
import store from './store'

const app = createApp(App).use(store).use(router).mount('#app')

