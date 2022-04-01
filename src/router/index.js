import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Initial from '@/views/Initial.vue';
import Users from '@/views/Users.vue';
import Roles from '@/views/Roles.vue';



const routes = [
    {path: '/', component: Initial},
    {path: '/home', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/users', component: Users},
    {path: '/roles', component: Roles}
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
