import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取列表
export const getList = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores', data)
}
// 修改店铺状态
export const editStatus = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/stores/${id}/status`, data)
}
// 根据id查看详情
export const getDetail = <T>(id: string) => {
  return api.get<T>(organizationService + `/stores/${id}`)
}
// 提交修改店铺
export const editSubmit = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/stores/${id}`, data)
}
// 提交新增店铺
export const addSubmit = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/stores', data)
}
// 校验店铺编码是否重复
export const validateStoreCode = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/storeCode', data)
}
// 校验店铺名称是否重复
export const validateStoreName = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/name', data)
}
