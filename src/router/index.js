import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Initial from '@/views/Initial.vue'

const routes = [
    {path: '/', component: Initial},
    {path: '/home', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register}
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
