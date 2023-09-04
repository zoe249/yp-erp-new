import { RouteRecordRaw } from 'vue-router'

// 重组后端返回的菜单为路由数据
const modules = import.meta.glob('../views/**/*.vue')
export const generatorMenuRoute = (arr: Array<any>) => {
  const _tempRoutes: Array<RouteRecordRaw> = []
  if (!arr || !arr.length) return
  arr.forEach((item) => {
    // 加 空字符串 为防止后台返回null报错
    const route: any = {
      path: item.url || '',
      name: item.routeName || '',
      component: modules[`../views${item.url}/index.vue`] || '', // vite写法
      children: item.permissionChildren || [],
      meta: {
        title: item.name || '',
        icon: item.logo || '',
        type: item.type,
        permissionKey: item.permissionKey,
        parentId: item.parentId,
        group: item.group || '', // 高亮父级菜单所需的属性
        rights: [],
        keepAlive: true
      }
    }
    if (item.permissionChildren && item.permissionChildren.length) {
      if (item.permissionChildren[0].type === '2') {
        route.children = generatorMenuRoute(item.permissionChildren)
        route.meta.rights = []
      } else {
        route.children = []
        route.meta.rights = generatorMenuRoute(item.permissionChildren)
      }
    }
    _tempRoutes.push(route)
  })
  return _tempRoutes
}
// 获取菜单路由第一项作为默认路由
export const getDefaultNodePath: any = (menus: any[]) => {
  let path = ''
  if (menus && menus.length) {
    if (menus[0].children && menus[0].children.length) {
      path = getDefaultNodePath(menus[0].children)
    } else {
      path = menus[0].path
    }
  }
  return path
}
