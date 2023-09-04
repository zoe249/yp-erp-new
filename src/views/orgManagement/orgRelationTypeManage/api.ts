import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'

export const orgTypeList = <T>(data: unknown) => {
  return api.get<T>(organizationService + '/organizations/organizationRelationType', data)
}

/**
 * 校验名称是否存在相同数据
 */
export const orgCheckName = <T>(data: { name: string; companyCode: string; id?: string }) => {
  return api.get<T>(organizationService + '/organizations/organizationRelationType/name', data)
}

/**
 * 校验编码是否存在相同数据
 */
export const orgCheckCode = <T>(data: { organizationRelationTypeCode: string; companyCode: string }) => {
  return api.get<T>(
    organizationService + '/organizations/organizationRelationType/organizationRelationTypeCode',
    data
  )
}

/**
 * 根据ID查询组织关系类型
 */
export const getDetailById = <T>(id: string) => {
  return api.get<T>(organizationService + '/organizations/organizationRelationType/' + id)
}

/**
 * 新增组织关系类型
 */
export const addSubmit = <T>(data: unknown) => {
  return api.post<T>(organizationService + '/organizations/organizationRelationType', data)
}

/**
 * 修改组织关系类型
 */
export const editById = <T>(id: string, data: unknown) => {
  return api.put<T>(organizationService + '/organizations/organizationRelationType/' + id, data)
}

/**
 * 修改组织关系类型状态
 */
export const editStatusById = <T>(id: string, data: { status: boolean | number }) => {
  return api.put<T>(organizationService + `/organizations/organizationRelationType/${id}/status`, data)
}
