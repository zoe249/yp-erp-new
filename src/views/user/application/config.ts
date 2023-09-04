export const tableHeaders = [
  {
    label: '企业',
    prop: 'companyCode',
    align: 'center',
    width: 120,
    isSlot: true,
    slotName: 'companyCode'
  },
  {
    label: '应用编码',
    prop: 'code',
    align: 'center',
    width: 100
  },
  {
    label: '应用名称',
    prop: 'name',
    align: 'center',
    width: 100
  },
  {
    label: '描述',
    prop: 'description',
    align: 'center',
    width: 140
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: 140
  },
  {
    label: '创建人',
    prop: 'createByDescr',
    align: 'center',
    sortable: 'custom',
    width: 100
  },
  {
    label: '修改时间',
    prop: 'updateTime',
    align: 'center',
    sortable: 'custom',
    width: 140
  },
  {
    label: '修改人',
    prop: 'updateByDescr',
    align: 'center',
    sortable: 'custom',
    width: 100
  },
  {
    label: '操作',
    align: 'center',
    width: 90,
    isSlot: true,
    slotName: 'operate'
  }
]

export const editForm = {
  id: '', // 判断是新增还是修改
  mktid: '',
  mktidDescr: '',
  deptid: '',
  deptidDescr: '',
  startid: '',
  endid: '',
  flagDep: '',
  flagCancel: false
}
