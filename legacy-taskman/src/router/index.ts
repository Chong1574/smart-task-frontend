import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Lazy loading views
const HomeView = () => import('../components/dashboard/HomeView.vue');
const FinanceView = () => import('../components/finance/FinanceView.vue');
const DashboardView = () => import('../views/DashboardView.vue');
const CalendarView = () => import('../views/CalendarView.vue');
const LoginView = () => import('../views/auth/LoginView.vue');
const RegisterView = () => import('../views/auth/RegisterView.vue');
const AuthCallbackView = () => import('../views/auth/AuthCallbackView.vue');

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: CalendarView,
        meta: { requiresAuth: true }
    },
    {
        path: '/wallet',
        name: 'wallet',
        component: FinanceView,
        meta: { requiresAuth: true }
    },
    {
        path: '/garage',
        name: 'garage',
        component: () => import('../views/GarageView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { guest: true }
    },
    {
        path: '/auth-callback',
        name: 'auth-callback',
        component: AuthCallbackView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard de navegación
router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = !!authStore.token;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.guest && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
