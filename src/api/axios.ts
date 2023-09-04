import axios from 'axios'
import { ElMessage } from 'element-plus'
import { tansParams } from '@/utils/index'
import errorCode from '@/utils/errorCode'
import useUserStore from '@/store/modules/user'
import router from '@/router'
const http = axios.create({
  timeout: 30000
})
// 设置 post、put 默认 Content-Type
http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'
// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // get请求映射params参数
    if (config.method == 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error) => Promise.reject(error)
)
// 添加响应拦截器
http.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    let code: string | number = ''
    if (res.data.code) {
      code = res.data.code.length > 3 ? Number(res.data.code.substring(0, 3)) : Number(res.data.code)
    } else {
      code = 200
    }
    // 获取错误信息
    const msg = errorCode[code] || res.data.detail || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res
    }
    if (code === 401) {
      ElMessage.error(msg)
      toLogin()
      return Promise.reject('无效的会话，或者Token已过期，请重新登录。')
    } else if (code === 403) {
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code === 500) {
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElMessage.error(msg)
      return Promise.reject(res.data)
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    console.log(error)
    const erText: string = error.toString()
    if (erText.search('Network Error') != -1) {
      ElMessage.error('后端接口连接异常')
    } else if (erText.search('timeout') != -1) {
      ElMessage.error('系统接口请求超时')
    } else if (error?.response?.data?.detail) {
      ElMessage.error(error.response.data.detail)
    } else {
      ElMessage.error('请求错误')
    }
    let code: string | number = ''
    if (error.response.data.code) {
      code =
        error.response.data.code.length > 3
          ? Number(error.response.data.code.substring(0, 3))
          : Number(error.response.data.code.code)
    } else {
      code = 200
    }
    if (code === 401) {
      toLogin()
    }
    return Promise.reject(error)
  }
)
// 失败跳转登录页
const toLogin = () => {
  useUserStore()
    .logOut()
    .then(() => {
      setTimeout(() => {
        router.replace('/login')
      }, 500)
    })
    .catch(() => {
      setTimeout(() => {
        router.replace('/login')
      }, 500)
    })
}
/**
 * 创建统一封装过的 axios 实例
 * @return {AxiosInstance}
 */
export default function () {
  return http
}
