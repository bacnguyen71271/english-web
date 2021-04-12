import Vue from 'vue'
import VueRouter from 'vue-router'
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn } from '@/auth/utils'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
      return { x: 0, y: 0 }
    },
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
            resource: 'View',
        },
      },
      {
        path: '/danh-muc/:slug',
        name: 'danh-muc',
        component: () => import('@/views/khoahoc/DanhMuc.vue'),
        meta: {
          resource: "View",
          pageTitle: '',
        },
      },
      {
        path: '/khoa-hoc/:slug',
        name: 'khoa-hoc',
        component: () => import('@/views/khoahoc/KhoaHoc.vue'),
        meta: {
          resource: "View",
          pageTitle: '',
        },
      },
      {
        path: '/bai-giang/:slug',
        name: 'bai-giang',
        component: () => import('@/views/khoahoc/BaiGiang.vue'),
        meta: {
          resource: "View",
          pageTitle: '',
        },
      },
      {
        path: '/dang-nhap',
        name: 'auth-login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
            redirectIfLoggedIn: true,
            pageTitle: '',
            resource: "Auth"
        },
      },
      {
        path: '/dang-ky',
        name: 'auth-register',
        component: () => import('@/views/auth/Register.vue'),
        meta: {
            // redirectIfLoggedIn: true,
            pageTitle: '',
            resource: "Auth"
        },
      },
      {
        path: '/error',
        name: 'error',
        component: () => import('@/views/Error.vue'),
        meta: {
          layout: 'full',
        },
      },
      {
        path: '*',
        redirect: 'error',
      },
    ],
})

router.beforeEach((to, _, next) => {
    const isLoggedIn = isUserLoggedIn()
    if (!canNavigate(to)) {
      if (!isLoggedIn) {
        return next({ name: 'auth-login' })
      }
    }
    if (to.meta.redirectIfLoggedIn && isLoggedIn) {
      next('/')
    }
    return next()
})

router.afterEach(() => {
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
      appLoading.style.display = 'none'
    }
})

export default router
