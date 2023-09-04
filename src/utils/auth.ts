import Cookies from 'js-cookie'

const TokenKey = 'satoken'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getCookieVal(name: string) {
  let arr: any = null
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  // eslint-disable-next-line no-cond-assign
  return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : ''
}
export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
