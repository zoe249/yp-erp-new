import { MockMethod } from 'vite-plugin-mock'
const menu = {
  id: '1572389071211335680',
  code: 'admin',
  realName: '用户1',
  avatar: null,
  organizationType: '03',
  organizationCode: '1',
  organizationDescr: null,
  headQuartersFlag: false,
  permissions: [
    {
      id: '01',
      name: '基础服务平台',
      url: null,
      logo: 'icon-mima',
      description: null,
      permissionKey: '01:*',
      displayOrder: 1,
      type: '1',
      parentId: '0',
      group: null,
      permissionChildren: [
        {
          id: '05',
          name: '用户权限',
          url: '/user/index',
          logo: 'icon-mima',
          description: null,
          permissionKey: '01:user:*',
          displayOrder: 3,
          type: '2',
          parentId: '01',
          group: '/user/index',
          permissionChildren: [
            {
              id: '0501',
              name: '应用管理',
              routeName: 'Application',
              url: '/user/application',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            },
            {
              id: '0505',
              name: '菜单管理',
              routeName: 'Menu',
              url: '/user/menu',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            },
            {
              id: '0502',
              name: '角色管理',
              routeName: 'RoleManagement',
              url: '/user/roleManagement',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            },
            {
              id: '0504',
              name: '用户管理',
              routeName: 'UserManagement',
              url: '/user/userManagement',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            },
            {
              id: '0503',
              name: '用户所属角色',
              routeName: 'Role',
              url: '/user/role',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            },
            {
              id: '0506',
              name: '用户字段权限',
              routeName: 'Field',
              url: '/user/field',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            },
            {
              id: '0507',
              name: '用户数据权限',
              routeName: 'Data',
              url: '/user/data',
              logo: 'icon-wuliuxinxi',
              description: null,
              permissionKey: '01:user:dic:*',
              displayOrder: 1,
              type: '2',
              parentId: '05',
              group: '/user/index',
              permissionChildren: []
            }
          ]
        }
      ]
    }
  ]
}

export default [
  {
    url: '/mock/api/users/currentUser',
    method: 'get',
    response: () => {
      return { code: '200', message: '请求成功', data: menu }
    }
  }
] as MockMethod[]
