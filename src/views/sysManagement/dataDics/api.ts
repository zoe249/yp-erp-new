import api from '@/api/index'
import { supportServer } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 获取字典列表
export const getDicsList = <T>(data?: unknown) => {
  return api.get<T>(supportServer + '/dataDics', data)
}
// 根据id获取项值列表
export const getDicsItemList = <T>(dicCode: string, data?: unknown) => {
  return api.get<T>(supportServer + `/dataDics/${dicCode}/itemValues`, data)
}
// 修改项值状态
export const changeItemStatus = <T>(dicCode: string, itemCode: string, data?: unknown) => {
  return api.put<T>(supportServer + `/dataDics/${dicCode}/itemValues/${itemCode}`, data)
}
// 新增项值
export const addItemSubmit = <T>(dicCode: string, data?: unknown) => {
  return api.post<T>(supportServer + `/dataDics/${dicCode}/itemValues`, data)
}
