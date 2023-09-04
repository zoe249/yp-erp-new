/**
 * 判断url是否是http或https
 * @param {string} path
 * @returns {Boolean}
 */
export const isHttp = (url: string | string[]) => {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 是否是字符串
 * @param {string} str
 * @returns {Boolean}
 */
export const isString = (str: any) => {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/** 是否是数组
 * @param {Array} arg
 * @returns {Boolean}
 */
export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
/** 校验手机号
 * @param {string} 手机号
 * @returns {Boolean}
 */
export const validatePhone = (rule: any, value: string, callback: (arg0?: Error | undefined) => void) => {
  const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!value) {
    callback()
  }
  if (!phoneReg.test(value)) {
    callback(new Error('请输入正确手机号'))
  } else {
    callback()
  }
}
// 校验账号
export const vlidateUser = async (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入账号'))
  }
  const reg = /^[a-zA-Z0-9_-]{3,16}$/
  if (!reg.test(value)) {
    callback(new Error('请输入30个字符以内的合法字符'))
  } else {
    callback()
  }
}
// 校验邮箱
export const validateEmail = (rule: any, value: string, callback: (arg0?: Error | undefined) => void) => {
  const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 校验真实姓名
export const vlidateRealName = async (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
  }
  if (value.length > 30) {
    callback(new Error('真实姓名不允许超过30个字符'))
  } else {
    callback()
  }
}
// 校验编码
export const validCode = (rule: any, value: any, callback: any) => {
  const reg = /^[0-9a-zA-Z]*$/g
  if (!value) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error(rule?.message || '请输入正确编码，只能由字母和数字组成'))
    } else if (value.length > 64) {
      callback(new Error('字符长度不得超过64位'))
    } else {
      callback()
    }
  }
}
