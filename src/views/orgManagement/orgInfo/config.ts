const defaultWidth = 100
export const tableHeaders = [
  {
    label: '组织编码',
    prop: 'organizationCode',
    width: defaultWidth,
    align: 'center'
  },
  {
    label: '组织名称',
    prop: 'name',
    width: defaultWidth,
    align: 'center'
  },
  {
    label: '组织类型',
    prop: 'organizationType',
    width: defaultWidth,
    align: 'center',
    isSlot: true,
    slotName: 'organizationType'
  },
  {
    label: '经营状态',
    prop: 'managementForms',
    width: defaultWidth,
    align: 'center',
    isSlot: true,
    slotName: 'managementForms'
  },
  {
    label: '地址',
    prop: 'address',
    width: 160,
    align: 'center',
    isSlot: true,
    slotName: 'address'
  },
  {
    label: '业态',
    prop: 'formats',
    width: 80,
    align: 'center',
    isSlot: true,
    slotName: 'formats'
  },
  {
    label: '有效状态',
    prop: 'status',
    width: defaultWidth,
    align: 'center',
    isSlot: true,
    slotName: 'status'
  },
  {
    label: '撤店标记',
    prop: 'closeFlag',
    width: defaultWidth,
    align: 'center',
    isSlot: true,
    slotName: 'closeFlag'
  },

  {
    label: '操作',
    width: 90,
    align: 'center',
    fixed: 'right',
    isSlot: true,
    showTooltip: false,
    slotName: 'operate'
  }
]
export const tableStepFstHeader = [
  {
    label: '组织关系类型',
    prop: 'organizationRelationTypeCode',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '父级组织',
    prop: 'parentOrganizationCode',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '有效期开始',
    prop: 'beginTime',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '有效期结束',
    prop: 'endTime',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '操作',
    prop: 'operate',
    width: 80,
    align: 'center',
    showTooltip: false
  }
]
export const tableStepLastHeader = [
  {
    label: '库区类型',
    prop: 'type',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '库区编码',
    prop: 'storageAreaCode',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '库区名称',
    prop: 'name',
    width: defaultWidth,
    align: 'center',
    showTooltip: false
  },
  {
    label: '操作',
    prop: 'operate',
    width: 80,
    align: 'center',
    showTooltip: false
  }
]
export const searchItem = [
  {
    prop: 'seachInfo',
    label: '组织',
    placeholder: '请输入编码或名称'
  },
  {
    prop: 'organizationType',
    label: '组织类型',
    type: 'select',
    selectOptions: []
  },
  {
    prop: 'formats',
    label: '业态',
    type: 'select',
    selectOptions: []
  }
]
