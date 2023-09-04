import api from '@/api/index'
import { authService, supportServer, userService } from '@/utils/apiConfig'
const apiServer = '/mock/api'
// 登录
export const login = <T>(type: string, data?: unknown) => {
  return api.post<T>(authService + (type == '1' ? '/auth/token' : '/auth/phoneToken'), data)
}
// 登出
export const loginOut = <T>(data?: unknown) => {
  return api.post<T>(authService + '/auth/logout', data)
}
// 获取用户信息
export const getUserInfo = <T>(data?: unknown) => {
  return api.get<T>(userService + '/users/currentUser', data)
}
// 获取图形验证
export const getVerifyImage = <T>(data?: unknown) => {
  return api.get<T>(authService + '/verifyImages', data)
}
// 发送验证码
export const sendVerifyCode = <T>(data?: unknown) => {
  return api.post<T>(supportServer + '/verificationCodeShortMessages', data)
}
// 重置密码
export const resetPwd = <T>(code: string, data?: unknown) => {
  return api.put<T>(userService + `/users/${code}:forgotPassword`, data)
}
// 修改密码
export const editPwd = <T>(code: string, data?: unknown) => {
  return api.put<T>(userService + `/users/${code}:updatePassword`, data)
}
