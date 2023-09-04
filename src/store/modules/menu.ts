import cache from '@/plugins/cache'
import { getUserInfo } from '@/views/login/api'
import { systemCode } from '@/utils/config'
const useMenuStore = defineStore('permission', {
  state: () => ({
    isSetMenu: false,
    currentPath: null,
    sidebarRouters: []
  }),
  actions: {
    setCurrentPath(obj: any) {
      this.currentPath = obj
    },
    changeisSetMenu(isSet: boolean) {
      this.isSetMenu = isSet
    },
    setSidebarRouters(routes: any) {
      this.sidebarRouters = routes
    },
    handleRouters(menus: any): any {
      if (!menus) menus = []
      this.setSidebarRouters(menus)
    },
    getRouter() {
      return new Promise((resolve, reject) => {
        const menus = cache.local.getJSON('menuRoutes')
        if (menus) {
          resolve(menus)
        } else {
          this.getRouterData()
            .then((res) => {
              resolve(res)
            })
            .catch((res) => {
              reject(res)
            })
        }
      })
    },
    getRouterData() {
      return new Promise((resolve, reject) => {
        getUserInfo<any>({ systemCode })
          .then((res) => {
            cache.local.setJSON('menuRoutes', res.data)
            resolve(res.data)
          })
          .catch((res) => {
            reject(res)
          })
      })
    }
  }
})
export default useMenuStore
