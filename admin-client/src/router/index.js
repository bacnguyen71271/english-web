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
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/course/category',
      name: 'course-category',
      component: () => import('@/views/course/Category.vue'),
      meta: {
        pageTitle: 'Danh mục khóa học',
        breadcrumb: [
          {
            text: 'Khóa học',
            active: false,
          },
          {
            text: 'Danh mục',
            active: true,
          },
        ],
      },
    },
    {
      path: '/course',
      name: 'course-list',
      component: () => import('@/views/course/Course.vue'),
      meta: {
        pageTitle: 'Danh sách khóa học',
        breadcrumb: [
          {
            text: 'Khóa học',
            active: true,
          },
        ],
      },
    },
    {
      path: '/course/lesson/:id',
      name: 'lesson-list',
      component: () => import('@/views/course/LessonList.vue'),
      meta: {
        pageTitle: 'Danh sách bài giảng',
        breadcrumb: [
          {
            text: 'Khóa học',
            active: false,
          },
          {
            text: 'Bài giảng',
            active: true,
          },
        ],
      },
    },
    {
      path: '/course/lesson/:course/edit/:id',
      name: 'lesson-edit',
      component: () => import('@/views/course/LessonEdit.vue'),
      meta: {
        pageTitle: 'Danh sách bài giảng',
        breadcrumb: [
          {
            text: 'Khóa học',
            active: false,
          },
          {
            text: 'Bài giảng',
            active: false,
          },
          {
            text: 'Sửa bài giảng',
            active: true,
          },
        ],
      },
    },
    {
      path: '/course/lesson/:course/add',
      name: 'lesson-add',
      component: () => import('@/views/course/LessonAdd.vue'),
      meta: {
        pageTitle: 'Danh sách bài giảng',
        breadcrumb: [
          {
            text: 'Khóa học',
            active: false,
          },
          {
            text: 'Bài giảng',
            active: false,
          },
          {
            text: 'Thêm bài giảng',
            active: true,
          },
        ],
      },
    },
    {
      path: '/product/code',
      name: 'product-code',
      component: () => import('@/views/product/Code.vue'),
      meta: {
        pageTitle: 'Mã sản phẩm',
        breadcrumb: [
          {
            text: 'Sản phẩm',
            active: false,
          },
          {
            text: 'Mã sản phẩm',
            active: true,
          },
        ],
      },
    },
    {
      path: '/product/code/create',
      name: 'product-code-create',
      component: () => import('@/views/product/CreateCode.vue'),
      meta: {
        pageTitle: 'Tạo mã sản phẩm',
        breadcrumb: [
          {
            text: 'Sản phẩm',
            active: false,
          },
          {
            text: 'Mã sản phẩm',
            active: false,
          },
          {
            text: 'Tạo mã sản phẩm',
            active: true,
          },
        ],
      },
    },
    {
      path: '/user',
      name: 'user-list',
      component: () => import('@/views/user/UserList.vue'),
      meta: {
        pageTitle: 'Danh sách người dùng',
        breadcrumb: [
          {
            text: 'Người dùng',
            active: false,
          },
          {
            text: 'Danh sách người dùng',
            active: true,
          },
        ],
      },
    },
    {
      path: '/user/role',
      name: 'user-role',
      component: () => import('@/views/user/Rule.vue'),
      meta: {
        pageTitle: 'Vai trò & Phân quyền',
        breadcrumb: [
          {
            text: 'Người dùng',
            active: false,
          },
          {
            text: 'Vai trò & Phân quyền',
            active: true,
          },
        ],
      },
    },
    {
      path: '/settings/menu',
      name: 'setting-menu',
      component: () => import('@/views/settings/menu/Index.vue'),
      meta: {
        pageTitle: 'Cài đặt menu',
        breadcrumb: [
          {
            text: 'Cài đặt',
            active: false,
          },
          {
            text: 'Cài đặt menu',
            active: true,
          },
        ],
      },
    },
    {
      path: '/settings/menu/edit/:id',
      name: 'setting-menu-edit',
      component: () => import('@/views/settings/menu/Edit.vue'),
      meta: {
        pageTitle: 'Sửa menu',
        breadcrumb: [
          {
            text: 'Cài đặt',
            active: false,
          },
          {
            text: 'Cài đặt menu',
            active: false,
          },
          {
            text: 'Sửa menu',
            active: true,
          },
        ],
      },
    },
    {
      path: '/settings/menu/add',
      name: 'setting-menu-edit',
      component: () => import('@/views/settings/menu/Add.vue'),
      meta: {
        pageTitle: 'Sửa menu',
        breadcrumb: [
          {
            text: 'Cài đặt',
            active: false,
          },
          {
            text: 'Cài đặt menu',
            active: false,
          },
          {
            text: 'Thêm menu',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'auth-login',
      component: () => import('@/views/authentication/Login.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login' })

    // If logged in => not authorized

    // return next({ name: 'misc-not-authorized' })
  }

  // Redirect if logged in

  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    // const userData = getUserData()
    next('/')
  }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
