const defaultWidth = 100
export const tableTreeHeaders = [
  {
    label: '区域',
    prop: 'name',
    align: 'left',
    width: 160,
    isSlot: true,
    slotName: 'name'
  },
  {
    label: '操作',
    align: 'center',
    width: 80,
    isSlot: true,
    fixed: 'right',
    showTooltip: false,
    slotName: 'operate'
  }
]
export const tableHeaders = [
  {
    label: '组织编码',
    prop: 'organizationCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '组织名称',
    prop: 'name',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '经营状态',
    prop: 'status',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'status'
  },
  {
    label: '地址',
    prop: 'district',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'district'
  },
  {
    label: '业态',
    prop: 'formats',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'formats'
  },
  {
    label: '操作',
    align: 'center',
    width: 120,
    isSlot: true,
    fixed: 'right',
    showTooltip: false,
    slotName: 'operate'
  }
]
export const searchItem = [
  {
    prop: 'precinctCode',
    label: '区域编码'
  },
  {
    prop: 'name',
    label: '名称'
  }
]
