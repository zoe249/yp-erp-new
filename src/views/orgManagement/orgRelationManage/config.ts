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
    label: '组织关系类型',
    prop: 'organizationRelationTypeCode',
    align: 'center',
    width: 120,
    isSlot: true,
    slotName: 'organizationRelationTypeCode'
  },
  {
    label: '父级组织',
    prop: 'parentOrganizationCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'parentOrganizationCode'
  },
  {
    label: '组织',
    prop: 'organizationCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'organizationCode'
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
    label: '有效期开始',
    prop: 'beginTime',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'beginTime'
  },
  {
    label: '有效期结束',
    prop: 'endTime',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'endTime'
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
    label: '操作',
    align: 'center',
    width: 180,
    isSlot: true,
    slotName: 'operate'
  }
]

export const searchItem = [
  {
    prop: 'organizationRelationTypeCode',
    label: '组织关系类型',
    placeholder: '请选择组织关系类型',
    type: 'select',
    selectOptions: [] as Array<any>
  },
  {
    prop: 'organizationCodeAndName',
    label: '组织',
    placeholder: '请输入组织编码或名称',
    type: 'input'
  }
]

export const transOrgHeaders = [
  {
    label: '组织编码',
    prop: 'organizationCode',
    width: 100,
    align: 'center'
  },
  {
    label: '名称',
    prop: 'name',
    width: 105,
    align: 'center'
  },
  {
    label: '组织类型',
    prop: 'organizationTypeDescr',
    width: 105,
    align: 'center'
  }
]
