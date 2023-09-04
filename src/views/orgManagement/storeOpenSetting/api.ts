import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取列表
export const getList = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/stores/storeOperatingSet', data)
}
// 根据id获取详情
export const getDetail = <T>(id: string) => {
  return api.get<T>(organizationService + `/stores/storeOperatingSet/${id}`)
}
// 保存修改
export const editSubmit = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/stores/storeOperatingSet/${id}`, data)
}
// 保存新增
export const addSubmit = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/stores/storeOperatingSet', data)
}
// 总部人员获取组织信息
export const getOrgsStore = <T>(data?: unknown) => {
  return api.get(organizationService + '/organizations', data)
}
// 修改有效状态
export const changeStatus = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/stores/storeOperatingSet/${id}/status`, data)
}
