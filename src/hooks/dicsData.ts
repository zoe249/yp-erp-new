import { supportServer } from '@/utils/apiConfig'
import { deepObjClone } from '@/utils/index'
import api from '@/api/index'
export const DicsObj = {
  S001: 'S001', // 业态
  S002: 'S002', // 口味
  S003: 'S003', // 颜色
  S004: 'S004', // 尺寸
  S005: 'S005', // 岗位
  H001: 'H001', // 组织类型
  H002: 'H002', // 库区类型
  H003: 'H003', // 店铺类型
  H004: 'H004', // 经营时间类型
  H005: 'H005', // 营业状态
  H006: 'H006', // 菜单类型
  H009: 'H009', // 权限功能选项
  H010: 'H010', // 筛选维度
  H011: 'H011', // 销项税
  H012: 'H012', // 商品状态
  H013: 'H013', // 商品类型
  H014: 'H014', // 商品属性
  H015: 'H015', // 计量方式
  H016: 'H016' // 税种
}
// 用户状态
export const userStatusDics = [
  { code: '01', name: '有效' },
  { code: '02', name: '无效' }
]
// 用户类型
export const userTypeDics = [
  { code: '0', name: '员工' },
  { code: '1', name: '合作伙伴' },
  { code: '2', name: '顾客' }
]
// 性别
export const sexDics = [
  { code: '0', name: '未知' },
  { code: '1', name: '男' },
  { code: '2', name: '女' }
]
// 店铺库区状态
export const storageStatus = [
  { code: true, name: '启用' },
  { code: false, name: '未启用' }
]
export const getDicsList = (code: string, params?: any): any => {
  const url = `${supportServer}/dataDics/${code}/itemValues`
  return new Promise((resolve, reject) => {
    api.get<any>(url, { status: true, ...params }).then((res) => {
      if (res.data) {
        resolve(res.data.data)
      } else {
        resolve([])
      }
    })
  })
}
/** 处理searchItem获取字典下拉
 * @param searchItem config里维护的searchItem
 * @param obj {属性名:字典}如{rfType:'DD010'}
 * @returns copyItem searchItem的深拷贝
 */
export async function initSearchItem(searchItem: any, obj: any) {
  const copyItem = deepObjClone(searchItem)
  if (!obj) return
  const promise = copyItem
    .filter((v: any) => v.type == 'select')
    .map(async (v: any) => {
      if (obj[v.prop]) {
        v.selectOptions = await getDicsList(obj[v.prop])
      }
    })
  await Promise.all(promise)
  return copyItem
}
