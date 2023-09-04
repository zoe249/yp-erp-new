import { userTypeDics, userStatusDics } from '@/hooks/dicsData'
const defaultWidth = 100
export const tableHeaders = [
  {
    label: '账号',
    prop: 'code',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '真实姓名',
    prop: 'realName',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '用户类型',
    prop: 'userType',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'userType'
  },
  {
    label: '所属组织',
    prop: 'organizationDescr',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '所属角色',
    prop: 'roleDescrs',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'status'
  },
  {
    label: '手机号',
    prop: 'phone',
    align: 'center',
    width: 120
  },
  {
    label: '邮箱',
    prop: 'email',
    align: 'center',
    width: 120
  },
  {
    label: '操作',
    align: 'center',
    width: 190,
    isSlot: true,
    fixed: 'right',
    showTooltip: false,
    slotName: 'operate'
  }
]
export const searchItem = [
  {
    prop: 'codeOrRealName',
    label: '姓名'
  },
  {
    prop: 'organizationCode',
    label: '所属组织',
    type: 'select',
    selectOptions: []
  },
  {
    prop: 'phone',
    label: '手机号'
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    selectOptions: userStatusDics
  },
  {
    prop: 'userType',
    label: '用户类型',
    type: 'select',
    selectOptions: userTypeDics
  }
]
