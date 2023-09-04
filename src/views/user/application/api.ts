import api from '@/api/index'
const mockApi = '/mock/api'
import { userService } from '@/utils/apiConfig'
export const applcationList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/systemCodes', data)
}

export const applcationInfo = <T>(id: string, data?: unknown) => {
  return api.get<T>(userService + '/systemCodes/' + id, data)
}

export const editApplcationInfo = <T>(id: string, data?: unknown) => {
  return api.put<T>(userService + '/systemCodes/' + id, data)
}
export const addApplcationInfo = <T>(data?: unknown) => {
  return api.post<T>(userService + '/systemCodes', data)
}
export const verifySystemName = <T>(data?: unknown) => {
  return api.get<T>(userService + '/systemCodes/name', data)
}
export const verifySystemCode = <T>(data?: unknown) => {
  return api.get<T>(userService + '/systemCodes/code', data)
}
