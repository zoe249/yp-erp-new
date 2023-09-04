import api from '@/api/index'
const mockApi = '/mock/api'
import { userService } from '@/utils/apiConfig'
export const roleList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/userRoleMapping', data)
}

export const roleInfo = <T>(id: string, data?: unknown) => {
  return api.get<T>(userService + '/users/userRoleMapping/' + id, data)
}

export const addRole = <T>(data?: unknown) => {
  return api.post<T>(userService + '/users/userRoleMapping', data)
}

export const deleteRole = <T>(id: string, data?: unknown) => {
  return api.delete<T>(userService + '/users/userRoleMapping/' + id, data)
}

export const applcationList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/systemCodes', data)
}

export const appRoleList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/roles', data)
}

export const editRole = <T>(id: string, data?: unknown) => {
  return api.put<T>(userService + '/users/userRoleMapping/' + id, data)
}
