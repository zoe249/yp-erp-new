import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'

/**
 * 分页查询组织关系
 */
export const orgList = <T>(data: unknown) => {
  return api.get<T>(organizationService + '/organizations/organizationRelation', data)
}

/**
 * 根据ID查询组织关系
 */
export const getDetailById = <T>(id: string) => {
  return api.get<T>(organizationService + `/organizations/organizationRelation/${id}/organizations`)
}

/**
 * 批量新增组织关系
 */
export const addSubmit = <T>(data: unknown) => {
  return api.post<T>(organizationService + '/organizations/organizationRelation', data)
}

/**
 * 修改组织关系
 */
export const editById = <T>(id: string, data: unknown) => {
  return api.put<T>(organizationService + `/organizations/organizationRelation/${id}/organizations`, data)
}

/**
 * 修改组织关系状态
 */
export const editStatusById = <T>(id: string, data: { status: boolean }) => {
  return api.put<T>(organizationService + `/organizations/organizationRelation/${id}/status`, data)
}

/**
 * 分页查询组织信息
 */
export const orgListInfo = <T>(data: unknown) => {
  return api.get<T>(organizationService + '/organizations', data)
}

/**
 * 查询组织关系类型
 */
export const orgTypeList = (data?: any) => {
  return api.get<any>(organizationService + '/organizations/organizationRelationType', data)
}

// （树状）查询管理区域
export const queryPrecincts = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/precincts/tree', data)
}

/**
 * 查询全部企业编码及名称
 */
export const getCompanyCode = <T>() => {
  return api.get<T>(organizationService + '/companys/findCodeAndName')
}
