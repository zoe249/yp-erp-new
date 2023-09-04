import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'
const mockApi = '/mock/api'
// 分页查询渠道管理
export const getChannels = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/channels', data)
}
// 树查询渠道管理
export const getChannelsTree = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/channels/tree', data)
}
// 根据ID查渠道管理
export const getChannelById = <T>(id: string) => {
  return api.get<T>(organizationService + `/channels/${id}`)
}
// 校验名称是否存在相同数据
export const validateNameExist = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/channels/name', data)
}
// 校验编码是否存在相同数据
export const validateCodeExist = <T>(data?: unknown) => {
  return api.get<T>(organizationService + '/channels/channelsCode', data)
}
// 新增渠道管理
export const addChannel = <T>(data?: unknown) => {
  return api.post<T>(organizationService + '/channels', data)
}
// 编辑渠道管理
export const modifyChannel = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/channels/${id}`, data)
}
// 删除渠道管理
export const deleteChannel = <T>(id: string) => {
  return api.delete<T>(organizationService + `/channels/${id}`)
}
// 更改状态
export const modifyChannelStatus = <T>(id: string, data?: unknown) => {
  return api.put<T>(organizationService + `/channels/${id}/status`, data)
}
