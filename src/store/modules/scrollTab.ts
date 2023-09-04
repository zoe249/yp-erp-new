import { applcationList } from '@/views/user/application/api'
import { companyList } from '@/views/orgManagement/company/api'
const useTabStore = defineStore('scrollTab', {
  state: () => ({
    getSystem: false,
    getCompany: false,
    systemList: [] as any[],
    companyList: [] as any[]
  }),
  actions: {
    setSytemList(arr: any[]) {
      this.systemList = arr || []
    },
    setCompanyList(arr: any[]) {
      this.companyList = arr || []
    },
    getSystemList() {
      return new Promise((resolve, reject) => {
        applcationList()
          .then((res: any) => {
            this.setSytemList(res.data)
            this.getSystem = true
            resolve(res.data)
          })
          .catch(() => {
            this.getSystem = true
            reject()
          })
      })
    },
    getCompanyList() {
      return new Promise((resolve, reject) => {
        companyList()
          .then((res: any) => {
            this.setCompanyList(res)
            this.getCompany = true
            resolve(res)
          })
          .catch(() => {
            this.getCompany = true
            reject()
          })
      })
    }
  }
})
export default useTabStore
