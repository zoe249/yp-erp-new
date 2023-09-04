import { removeToken } from '@/utils/auth'
import { loginOut } from '@/views/login/api'
import { getUserInfo } from '@/views/login/api'
import { systemCode } from '@/utils/config'
import cache from '@/plugins/cache'
type userInfo = {
  id: number
  code: string
  realName: string
  avatar: string
  [key: string]: unknown
}
const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as userInfo
  }),
  actions: {
    setUserInfo(obj: any) {
      this.userInfo = obj
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        const userInfo = cache.local.getJSON('userInfo')
        if (userInfo) {
          resolve(userInfo)
        } else {
          resolve(this.getInfoData())
        }
      })
    },
    // 通过接口获取用户信息
    getInfoData() {
      return new Promise((resolve, reject) => {
        getUserInfo<any>({ systemCode })
          .then((res) => {
            const {
              id,
              code,
              realName,
              avatar,
              organizationCode,
              organizationType,
              organizationDescr,
              headQuartersFlag,
              email,
              phone,
              status,
              genderDescr,
              roleDescrs
            } = res.data
            const userInfo = {
              id,
              code,
              realName,
              avatar,
              organizationType,
              organizationCode,
              organizationDescr,
              headQuartersFlag,
              phone,
              email,
              status,
              genderDescr,
              roleDescrs: roleDescrs?.join('、')
            }
            cache.local.setJSON('userInfo', userInfo)
            cache.local.setJSON('menuRoutes', res.data)
            this.setUserInfo(userInfo)
            resolve(userInfo)
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve) => {
        loginOut().then(() => {
          cache.local.remove('userInfo')
          cache.local.remove('menuRoutes')
          removeToken()
          resolve(true)
        })
      })
    }
  }
})

export default useUserStore
