import api from '@/api/index'
const mockApi = '/mock/api'
import { userService } from '@/utils/apiConfig'
export const menuList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/permissions', data)
}

export const menuInfo = <T>(id: string, data?: unknown) => {
  return api.get<T>(userService + '/permissions/' + id, data)
}

export const editMenuInfo = <T>(id: string, data?: unknown) => {
  return api.put<T>(userService + '/permissions/' + id, data)
}

export const applcationList = <T>(data?: unknown) => {
  return api.get<T>(userService + '/systemCodes', data)
}
