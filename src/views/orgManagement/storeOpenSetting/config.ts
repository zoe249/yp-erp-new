const defaultWidth = 100
export const searchItem = [
  {
    prop: 'code',
    label: '门店编码',
    placeholder: '请输入门店编码'
  },
  {
    prop: 'type',
    label: '店铺类型',
    placeholder: '请选择店铺类型',
    type: 'select',
    selectOptions: [] as any
  },
  {
    prop: 'store',
    label: '店铺',
    placeholder: '请输入店铺编码或名称'
  },
  {
    prop: 'operatingStatus',
    label: '营业状态',
    placeholder: '请选择营业状态',
    type: 'select',
    selectOptions: [] as any
  }
]
export const tableHeaders = [
  {
    label: '门店编码',
    prop: 'organizationCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'organizationCode'
  },
  {
    label: '店铺类型',
    prop: 'type',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'type'
  },
  {
    label: '店铺',
    prop: 'storeCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'storeCode'
  },
  {
    label: '有效状态',
    prop: 'status',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'status'
  },
  {
    label: '营业状态',
    prop: 'operatingStatus',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'operatingStatus'
  },
  {
    label: '经营时间类型',
    prop: 'durationType',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'durationType'
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
    label: '操作',
    align: 'center',
    width: 190,
    isSlot: true,
    fixed: 'right',
    showTooltip: false,
    slotName: 'operate'
  }
]
export const transferTableHeader = [
  {
    label: '组织编码',
    prop: 'organizationCode',
    align: 'center'
  },
  {
    label: '组织名称',
    prop: 'name',
    align: 'center'
  },
  {
    label: '组织类型',
    prop: 'organizationType',
    align: 'center',
    isSlot: true,
    slotName: 'organizationType'
  }
]
