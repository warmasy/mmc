import { createWebHistory, createRouter } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile/:activeTab?',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/website-data',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/transportCrypto/index'),
        name: 'WebsiteData',
        meta: { title: '网站数据', icon: 'chart' }
      }
    ]
  },
  {
    path: '/online',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/online/index'),
        name: 'Online',
        meta: { title: '在线用户', icon: 'online' }
      }
    ]
  },
  {
    path: '/logininfor',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/logininfor/index'),
        name: 'Logininfor',
        meta: { title: '登录日志', icon: 'logininfor' }
      }
    ]
  }
]

export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
});

export default router;
