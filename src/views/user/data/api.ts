import api from '@/api/index'
import { userService, organizationService } from '@/utils/apiConfig'

// 获取用户数据权限列表
export const dataList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/userDataPermission', data)
}

// 删除
export const deleteDataById = <T>(id: string) => {
  return api.delete<T>(userService + '/users/userDataPermission/' + id)
}

// 查看数据权限详情
export const getDetailById = <T>(id: string) => {
  return api.get<T>(userService + '/users/userDataPermission/' + id)
}

// 修改用户数据权限
export const editDataById = <T>(id: string, data: unknown) => {
  return api.put<T>(userService + '/users/userDataPermission/' + id, data)
}

// 新增
export const addSubmit = <T>(data: unknown) => {
  return api.post<T>(userService + '/users/userDataPermission', data)
}

// 获取系统列表
export const systemList = <T>() => {
  return api.get<T>(userService + '/systemCodes')
}

// 获取菜单
export const menuTree = <T>(data: unknown) => {
  return api.get<T>(userService + '/permissions', data)
}

// （树状）查询管理区域
export const queryPrecincts = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/precincts/tree', data)
}

// 分页查询组织信息
export const queryOrg = <T>(params: unknown) => {
  return api.get<T>(organizationService + '/organizations', params)
}

// 分页查询门店店铺
export const queryStore = <T>(params: unknown) => {
  return api.get<T>(organizationService + '/stores//storeOperatingSet', params)
}
