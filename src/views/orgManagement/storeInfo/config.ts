const defaultWidth = 100
export const searchItem = [
  {
    prop: 'store',
    label: '店铺',
    placeholder: '请输入店铺编码或名称'
  },
  {
    prop: 'type',
    label: '店铺类型',
    placeholder: '请选择店铺类型',
    type: 'select',
    selectOptions: [] as any
  }
]
export const tableHeaders = [
  {
    label: '店铺类型',
    prop: 'type',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'type'
  },
  {
    label: '店铺编码',
    prop: 'storeCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '店铺名称',
    prop: 'name',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '修改时间',
    prop: 'updateTime',
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
    label: '必有店铺',
    prop: 'necessary',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'necessary'
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
