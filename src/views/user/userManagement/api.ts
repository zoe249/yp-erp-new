import api from '@/api/index'
import { userService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取用户列表
export const getUserMList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users', data)
}
// 修改用户
export const editSubmit = <T>(id: string, data?: unknown) => {
  return api.put<T>(userService + '/users/' + id, data)
}
// 新增用户
export const addSubmit = <T>(data?: unknown) => {
  return api.post<T>(userService + '/users', data)
}
// 校验账号重复
export const validUsersCodeExist = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/code', data)
}
// 校验账号是否存在
export const validCodeHas = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/name', data)
}
// 查询所有应用角色
export const getSystemRole = <T>(data?: unknown) => {
  return api.get<T>(userService + '/roles/systemRoles', data)
}
// 获取用户详情
export const getDetailById = <T>(id: string) => {
  return api.get<T>(userService + '/users/' + id)
}
// 重置密码
export const resetPwdById = <T>(id: string) => {
  return api.put<T>(userService + `/users/${id}:resetPassword`)
}
