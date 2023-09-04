const defaultWidth = 100
export const tableHeaders1 = [
  {
    label: '应用',
    prop: 'systemCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'systemCode'
  },
  {
    label: '角色名称',
    prop: 'name',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'name'
  },
  {
    label: '有效期开始',
    prop: 'beginTime',
    align: 'center',
    width: 120
  },
  {
    label: '有效期结束',
    prop: 'endTime',
    align: 'center',
    width: 120
  },
  {
    label: '角色类型',
    prop: 'type',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'type'
  },
  {
    label: '操作',
    align: 'center',
    width: 90,
    isSlot: true,
    slotName: 'operate',
    fixed: 'right'
  }
]
export const tableHeaders2 = [
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
    label: '状态',
    prop: 'status',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'status'
  },
  {
    label: '操作',
    align: 'center',
    width: 100,
    isSlot: true,
    slotName: 'operate',
    fixed: 'right'
  }
]
export const searchItem = [
  {
    prop: 'roleName',
    label: '角色名称',
    clearable: true
  }
]
