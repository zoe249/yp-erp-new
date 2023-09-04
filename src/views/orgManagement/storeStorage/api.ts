import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取列表
export const getList = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/storeStorageArea', data)
}
// 修改店铺库区状态
export const editStatus = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/stores/storeStorageArea/${id}`, data)
}
// 提交新增店铺库区
export const addSubmit = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/stores/storeStorageArea', data)
}
// 校验是否重复
export const validateRepeat = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/storeStorageArea/exist', data)
}
// 根据门店编码获取库区信息
export const queryStorage = <T>(data?: unknown) => {
  return api.get(organizationService + '/storageAreas/organizationCode', data)
}
// 根据门店编码获取有效店铺
export const queryStores = <T>(data?: unknown) => {
  return api.get(organizationService + '/stores/storeOperatingSet/organizationCode', data)
}
