/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare interface Response<T> {
  code: number | string
  detail: string
  message: string
  data: T
  [key: string]: any
}
declare module 'nprogress'
declare module 'element-plus/dist/locale/zh-cn.mjs'
export declare global {
  interface Window {
    init: any //全局变量名
    qq: any //全局变量名
  }
}
