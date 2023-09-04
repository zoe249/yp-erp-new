import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'

/**
 * 分页查询库区信息
 */
export const getList = <T>(data: unknown) => {
  return api.get<T>(organizationService + '/storageAreas', data)
}

/**
 * 添加库区信息
 */
export const addSubmit = <T>(data: unknown) => {
  return api.post<T>(organizationService + '/storageAreas', data)
}

/**
 * 修改库区管理状态
 */
export const editStatusById = <T>(id: string, data: unknown) => {
  return api.put<T>(organizationService + `/storageAreas/${id}/status`, data)
}

/**
 * 校验是否存在相同数据
 */
export const checkByCode = <T>(orgCode: string, storageCode: string) => {
  return api.get<T>(
    organizationService + `/storageAreas/organizationCode/${orgCode}/storageAreaCode/${storageCode}`
  )
}

/**
 * 根据ID修改库区信息
 */
export const editById = <T>(id: string, data: unknown) => {
  return api.put<T>(organizationService + `/storageAreas/${id}`, data)
}

/**
 * 跟进ID查看库区详情
 */
export const getDetailById = <T>(id: string) => {
  return api.get<T>(organizationService + `/storageAreas/${id}`)
}

/**
 * 查询企业全部信息
 */
export const companyList = <T>() => {
  return api.get<T>(organizationService + '/companys')
}
