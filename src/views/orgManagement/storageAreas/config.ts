const defaultWidth = 100

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
    label: '库区类型',
    prop: 'type',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'type'
  },
  {
    label: '库区编码',
    prop: 'storageAreaCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '库区名称',
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
    label: '操作',
    align: 'center',
    width: 180,
    isSlot: true,
    slotName: 'operate'
  }
]

export const searchItem = [
  {
    label: '门店编码',
    prop: 'organizationCode',
    placeholder: '请输入门店编码',
    type: 'input'
  },
  {
    label: '库区类型',
    prop: 'type',
    placeholder: '请选择库区类型',
    type: 'select',
    selectOptions: [] as Array<any>
  },
  {
    label: '状态',
    prop: 'status',
    placeholder: '请选择状态',
    type: 'select',
    selectOptions: [] as Array<any>
  }
]

export const formItem = [
  {
    label: '企业',
    prop: 'companyCode',
    placeholder: '请选择企业',
    type: 'select',
    disabled: true,
    selectOptions: []
  },
  {
    label: '门店编码',
    prop: 'organizationCode',
    placeholder: '请输入门店编码',
    type: 'input',
    disabled: false
  },
  {
    label: '库区类型',
    prop: 'type',
    placeholder: '请选择库区类型',
    type: 'select',
    selectOptions: []
  },
  {
    label: '库区编码',
    prop: 'storageAreaCode',
    placeholder: '请输入库区编码',
    type: 'input',
    disabled: false
  },
  {
    label: '库区名称',
    prop: 'name',
    placeholder: '请输入库区名称',
    type: 'input'
  },
  {
    label: '状态',
    prop: 'status',
    type: 'switch'
  }
]
