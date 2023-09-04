import api from './index'
import { organizationService, userService } from '@/utils/apiConfig'
export default {
  getAllOrgInfo<T>(data: unknown) {
    return api.get<T>(organizationService + '/organizations', data)
  },
  /** 根据编码查询用户企业 */
  getCompanyByUser<T>(data: unknown) {
    return api.get<T>(userService + '/users/selectUserCompany', data)
  }
}
