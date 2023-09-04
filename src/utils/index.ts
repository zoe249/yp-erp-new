/**
 * 函数防抖
 * @param func 回调函数
 * @param wait 延迟执行的时间
 * @param immediate 是否立即执行一次
 */
export function debounce(func: (val: string) => void, wait: number, immediate = true) {
  let timeout: any, result: any
  return function (this: any) {
    const self = this
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(self, args as any)
    } else {
      timeout = setTimeout(function () {
        func.apply(self, args as any)
      }, wait)
    }
    return result
  }
}
/**
 * 表格时间格式化
 * @param cellValue 传入的时间Date格式
 * @param isDate 是否返回年月日格式
 */
export function formatDate(cellValue: Date | string, isDate = false) {
  if (cellValue == null || cellValue == '') return ''
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if (isDate) {
    return year + '-' + month + '-' + day
  } else {
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  }
}
/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}
/**
 * 返回项目路径
 * @param p String
 * @returns
 */
export function getNormalPath(p: string) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p
  }
  const res = p.replace('//', '/')

  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}
/**
 * 获取url query 参数
 * @param {string} key
 * @returns {string}
 */

export function getQuery(key: string | number) {
  const search = window.location.search
  /* istanbul ignore if */
  if (search) {
    const index = search.indexOf('?')
    const queryArr = search.substring(index + 1, search.length).split('&')
    const obj: any = {}
    for (const item of queryArr) {
      const arr = item.split('=')
      obj[arr[0]] = arr[1]
    }
    return obj[key]
  }
  return ''
}
/**
 * 拼接编码和名称函数
 * @param code 编码
 * @param name 名称
 * @returns 编码-名称
 */
export function spliceCodeName(code: string, name: string) {
  if ((code || code == '0') && name) {
    return code + ' - ' + name
  } else if (code || code == '0') {
    return code
  } else if (name) {
    return name
  } else {
    return ''
  }
}
/**
 * 通过code获取字典name
 * @param {Array} arr 字典下拉数组
 * @param {string} key 查询的字典code
 * @returns 字典的中文名
 */
export function getDicsName(arr: TselectOptions[], key: string, isNameAndCode?: boolean) {
  if (!arr || arr.length == 0 || !key) return
  const nameItem = arr.filter((v) => v.code == key)
  if (nameItem.length == 0) {
    return ''
  } else {
    return isNameAndCode ? nameItem[0].code + ' - ' + nameItem[0].name : nameItem[0].name
  }
}
/**
 * 深拷贝
 * @param obj 拷贝的原对象
 * @returns 拷贝后的对象
 */
export const deepObjClone = (obj: any) => {
  const weakMap = new WeakMap()
  function clone(obj: any) {
    if (obj == null) {
      return obj
    }
    if (obj instanceof Date) {
      return new Date(obj)
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj)
    }
    if (typeof obj !== 'object') return obj

    if (weakMap.get(obj)) {
      return weakMap.get(obj)
    }
    const copy = new obj.constructor()
    weakMap.set(obj, copy)
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        copy[key] = clone(value)
      }
    }
    return copy
  }
  return clone(obj)
}

export const setDuringDate = (yearNum?: number) => {
  if (!yearNum) {
    yearNum = 50
  }
  const date = new Date()
  const startDate = formatDate(date, true)
  let endDate: any = date.setFullYear(date.getFullYear() + yearNum)
  endDate = formatDate(endDate, true)
  return {
    startDate,
    endDate
  }
}

/**
 *
 * @param ary  原数组
 * @param key 属性key名称
 * @param keyWord 搜索关键词
 * @param children 子节点名称
 * @returns
 */
export const searchFilter = (ary: Array<any>, key: string, keyWord: string, children: string) => {
  if (!keyWord) return ary
  if (!key) return ary
  if (!ary) return
  const tempAry: any = []
  const filterData = (ary: Array<any>, key: string, keyWord: string, children: string) => {
    ary.forEach((item) => {
      if (item[key].includes(keyWord)) {
        tempAry.push(item)
      } else if (item[children] && item[children].length > 0) {
        filterData(item[children], key, keyWord, children)
      }
    })
  }
  filterData(ary, key, keyWord, children)

  return tempAry
}
/**
 * 搜索树
 * @param tree 树结构数据
 * @param form 搜索表单对象
 * @param children 树结构children的别名
 * @returns 筛选后的树
 */
export function filterTreeArray(tree: any[], form: any, children = 'children'): any {
  const arr = JSON.parse(JSON.stringify(tree))
  const emptyArr = []
  for (const item of arr) {
    let hasSearch = true
    for (const key in form) {
      if (form[key] && !item[key].includes(form[key])) {
        hasSearch = false
      }
    }
    if (hasSearch) {
      if (item[children] && Array.isArray(item[children]) && item[children].length > 0) {
        item[children] = filterTreeArray(item[children], form, children)
      }
      emptyArr.push(item)
    } else if (item[children] && Array.isArray(item[children]) && item[children].length > 0) {
      item[children] = filterTreeArray(item[children], form, children)
      console.log(item)
      if (item[children].length) {
        emptyArr.push(item)
      }
    }
  }
  return emptyArr
}
// 地图
export const loadTMapScript = () => {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(window.qq)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/js?v=2.exp&callback=init&key=772BZ-QC7WF-OHJJG-J7V3W-ZGJEV-3FFFE'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
export const filterData = (arr: any, time: any, valueWeek: any) => {
  // 循环我存的数据
  for (let i = 0; i < arr.length; i++) {
    // 看看存的数据的时间唯一建是什么
    const _keyTime = Object.keys(arr[i])[0]
    // 如果这次存的时间和数组里有的时间一致，说明属于他们组
    if (_keyTime === time) {
      // 取他们组的数据（就是周几到周几的那个数组）
      // 把加入到他们当中取 append
      const _valueWeek = arr[i][_keyTime]
      _valueWeek.push(valueWeek)
      return
    }
  }
  // 之前存的主键，没有当前时间的且不要和默认时间相等的数据
  const obj = {} as any
  obj[time] = [valueWeek]
  arr.push(obj)
  return
}
const handleTime = (arr: any, index: any) => {
  for (const i in arr) {
    if (index !== i) {
      const index0 = arr[index].startTime
      const index1 = arr[index].endTime
      const i0 = arr[i].startTime
      const i1 = arr[i].endTime
      if (i0 <= index0 && i1 > index0) {
        return false
      }
      if (i0 < index1 && i1 >= index1) {
        return false
      }
    }
  }
  return true
}
// 校验多个时间段不能重复或重叠
export const handleRepeatTime = (arr: any) => {
  for (const k in arr) {
    if (!handleTime(arr, k)) {
      return false
    }
  }
  return true
}
