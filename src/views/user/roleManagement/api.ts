import api from '@/api/index'
import { userService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取角色列表
export const getRoleMList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/roles', data)
}
// 获取用户列表
export const getUserMList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/userRoleMapping', data)
}
// 修改角色
export const editSubmit = <T>(id: string, data?: unknown) => {
  return api.put<T>(userService + '/roles/' + id, data)
}
// 新增角色
export const addSubmit = <T>(data?: unknown) => {
  return api.post<T>(userService + '/roles', data)
}
// 删除角色
export const delSubmit = <T>(id?: string) => {
  return api.delete<T>(userService + '/roles/' + id)
}
// 删除用户所属角色
export const delUserSubmit = <T>(id?: string) => {
  return api.delete<T>(userService + '/users/userRoleMapping/' + id)
}
// 校验角色名称重复
export const validateNameExist = <T>(data?: unknown) => {
  return api.get<T>(userService + '/roles/name', data)
}
// 获取角色详情
export const getRoleDetailById = <T>(id: string) => {
  return api.get<T>(userService + '/roles/' + id)
}
