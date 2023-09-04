const defaultWidth = 100
// index 表头
export const tableHeaders = [
  {
    label: '企业',
    prop: 'companyCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'companyCode'
  },
  {
    label: '类型编码',
    prop: 'organizationRelationTypeCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '类型名称',
    prop: 'name',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '规则说明',
    prop: 'description',
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
