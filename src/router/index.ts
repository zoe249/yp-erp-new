import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoutes } from './staticRoutes'
import { ElMessage } from 'element-plus'
import useMemuStore from '@/store/modules/menu'
import useUserStore from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import { generatorMenuRoute } from '@/utils/router'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/resetPwd']
const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
NProgress.configure({ showSpinner: false })
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (to.path === '/401') {
      next()
    } else {
      if (!useMemuStore().isSetMenu) {
        addRouterFn(to, next)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
function addRouterFn(to: any, next: (arg0: any) => void) {
  useMemuStore()
    .getRouter()
    .then((res: any) => {
      useMemuStore().changeisSetMenu(true)
      let asyncRoutes: any = []
      if (res.permissions && res.permissions.length > 0) {
        if (!res.permissions[0].permissionChildren.length) return
        asyncRoutes = generatorMenuRoute(res.permissions[0].permissionChildren)
        useMemuStore().handleRouters(asyncRoutes)
        asyncRoutes.forEach((item: any) => {
          router.addRoute('Layout', item)
        })
        next({ ...to, replace: true })
      } else {
        // 没有返回任何权限时
        NProgress.done()
        ElMessage({
          type: 'error',
          message: '已登录，权限为空，请联系管理员绑定权限',
          duration: 3000
        })
        next('/401')
      }
    })
    .catch(() => {
      useUserStore()
        .logOut()
        .then(() => {
          next({ path: '/' })
        })
    })
}
router.afterEach(() => {
  NProgress.done()
})
export default router
