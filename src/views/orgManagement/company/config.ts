const defaultWidth = 100
export const tableHeaders = [
  {
    label: '企业编码',
    prop: 'companyCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '企业名称',
    prop: 'companyName',
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
    label: '联系人',
    prop: 'contacts',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '联系电话',
    prop: 'phone',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '详细地址',
    prop: 'address',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center'
    // width: defaultWidth
  },
  {
    label: '创建人',
    prop: 'createBy',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'createBy'
  },
  {
    label: '修改时间',
    prop: 'updateTime',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '修改人',
    prop: 'updateBy',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'updateBy'
  },
  {
    label: '操作',
    align: 'center',
    width: 180,
    isSlot: true,
    slotName: 'operate'
  }
]

export const formItem = [
  {
    label: '企业编码',
    prop: 'companyCode',
    placeholder: '请输入企业编码',
    type: 'input'
  },
  {
    label: '企业名称',
    prop: 'companyName',
    placeholder: '请输入企业名称',
    type: 'input'
  },
  {
    label: '状态',
    prop: 'status',
    type: 'check'
  },
  {
    label: '联系人',
    prop: 'contacts',
    placeholder: '请输入联系人',
    type: 'input'
  },
  {
    label: '联系电话',
    prop: 'phone',
    placeholder: '请输入联系电话',
    type: 'input'
  },
  {
    label: '详细地址',
    prop: 'address',
    placeholder: '请输入详细地址',
    type: 'input'
  }
]
