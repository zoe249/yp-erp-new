import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 分页查询组织
export const getOrgData = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizations', data)
}
// 不分页查询组织
export const getOrgList = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizations/selectByCondition', data)
}
// 根据ID查询单个组织信息
export const getOrgById = <T>(id: string) => {
  return api.get<T>(organizationService + `/organizations/${id}`)
}
// 添加组织信息
export const addOrgInfo = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/organizations', data)
}
// 修改组织信息
export const editOrgInfo = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/organizations/${id}`, data)
}
// 修改组织信息状态
export const updateOrgStatus = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/organizations/${id}/status`, data)
}
// 校验名称是否存在相同数据
export const validateNameExist = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizations/name', data)
}
// 校验编码是否存在相同数据
export const validateCodeExist = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizations/organizationCode', data)
}
// 根据组织类型查询组织关系
export const getOrgRelations = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizationRelations', data)
}
// 查询总部组织（无权限）
export const getTopOrgan = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/organizations/topOrgan', data)
}
// 校验库区是否重复
export const validateStorageAreaCode = <T>(organizationCode: string, storageAreaCode: string) => {
  return api.get<T>(
    organizationService +
      `/storageAreas/organizationCode/${storageAreaCode}/storageAreaCode/${storageAreaCode}`
  )
}
