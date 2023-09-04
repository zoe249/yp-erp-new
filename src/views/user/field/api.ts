import api from '@/api/index'
const mockApi = '/mock/api'
import { userService } from '@/utils/apiConfig'
export const fieldList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/userFieldPermission', data)
}

export const fieldLInfo = <T>(id: string, data?: unknown) => {
  return api.get<T>(userService + '/users/userFieldPermission/' + id, data)
}

export const addField = <T>(data?: unknown) => {
  return api.post<T>(userService + '/users/userFieldPermission', data)
}

export const deleteField = <T>(id: string, data?: unknown) => {
  return api.delete<T>(userService + '/users/userFieldPermission/' + id, data)
}

export const applcationList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/systemCodes', data)
}

export const editField = <T>(id: string, data?: unknown) => {
  return api.put<T>(userService + '/users/userFieldPermission/' + id, data)
}
