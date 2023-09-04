import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 分页查询管理区域
export const getAreaList = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/precincts', data)
}
// 查询管理区域树
export const getAreaTree = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/precincts/tree', data)
}
// 查询门店
export const getOrgStore = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizations', data)
}
// 修改组织关系状态
export const updateStoreStatus = <T>(id?: unknown) => {
  return api.put<T>(organizationService + `/organizations/organizationRelation/${id}:status`)
}
// 根据id查管理区域
export const getAreaById = <T>(id?: unknown) => {
  return api.get<T>(organizationService + `/precincts/${id}`)
}
// 新增管理区域
export const addArea = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/precincts', data)
}
// 修改管理区域
export const editArea = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/precincts/${id}`, data)
}
// 删除管理区域
export const deleteArea = <T>(id: string) => {
  return api.delete<T>(organizationService + `/precincts/${id}`)
}
// 编辑区域下门店
export const editStore = <T>(id: string, data?: unknown) => {
  return api.put<T>(
    organizationService + `/organizations/organizationRelation/${id}:updateParentOrganization`,
    data
  )
}
// 校验是否存在相同数据
export const areaExistCode = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/precincts/precinctCode', data)
}
// 校验是否存在相同数据
export const areaExistName = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/precincts/name', data)
}
// 批量新增组织
export const addOrgStores = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/organizations/organizationRelation', data)
}
// 获取组织关系详情
export const getOrgRelationDetail = <T>(id: string) => {
  return api.get<T>(organizationService + `/organizations/${id}`)
}
