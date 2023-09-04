import api from '@/api/index'
import { fileServer } from '@/utils/apiConfig'
// 获取图片上传信息
export const getQiniu = <T>() => {
  return api.get<T>(fileServer + '/qiniu/token')
}
