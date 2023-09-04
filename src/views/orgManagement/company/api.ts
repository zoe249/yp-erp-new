import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'

/**
 * 查询企业全部信息
 */
export const companyList = <T>() => {
  return api.get<T>(organizationService + '/companys')
}

/**
 * 企业状态取反修改
 */
export const editStatusById = <T>(id: string) => {
  return api.put<T>(organizationService + `/companys/modifyStatus/${id}`)
}

/**
 * 新增企业信息
 */
export const addSubmit = <T>(data: unknown) => {
  return api.post<T>(organizationService + '/companys', data)
}

/**
 * 修改企业信息
 */
export const editCompanyById = <T>(id: string, data: unknown) => {
  return api.put<T>(organizationService + `/companys/${id}`, data)
}

/**
 * 根据ID查询企业信息
 */
export const getDetailById = <T>(id: string) => {
  return api.get<T>(organizationService + `/companys/${id}`)
}

/**
 * 查询企业编码是否存在
 */
export const checkCode = <T>(companyCode: string) => {
  return api.get<T>(organizationService + `/companys/codeExist/${companyCode}`)
}

/**
 * 查询企业名字是否存在
 */

// export const checkName = <T>(companyName: string) => {
//   return api.get<T>(organizationService+)
// }
