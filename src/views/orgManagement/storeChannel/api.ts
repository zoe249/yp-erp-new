import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取列表
export const getList = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/storeChannels', data)
}
// 修改店铺渠道状态
export const editStatus = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/stores/storeChannels/${id}`, data)
}
// 提交新增店铺渠道
export const addSubmit = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/stores/storeChannels', data)
}
// 校验是否重复
export const validateRepeat = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/storeChannels/exist', data)
}
// 查询渠道管理（树状）
export const queryChannels = <T>(data?: unknown) => {
  return api.get(organizationService + '/channels/tree', data)
}
// 根据门店编码获取有效店铺
export const queryStores = <T>(data?: unknown) => {
  return api.get(organizationService + '/stores/storeOperatingSet/organizationCode', data)
}
