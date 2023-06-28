import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import ('../views/DashboardView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import ('../views/authentication/LoginView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import ('../views/authentication/RegisterView.vue')
        }
    ]
})

export default router