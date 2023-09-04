export const tableHeaders = [
  {
    label: '名称',
    prop: 'name',
    align: 'center',
    width: 180
  },
  {
    label: '序号',
    prop: 'displayOrder',
    align: 'center',
    width: 140
  },
  {
    label: '图标',
    align: 'center',
    width: 140,
    sortable: 'custom',
    isSlot: true,
    slotName: 'logo'
  },
  {
    label: '描述',
    prop: 'description',
    align: 'center',
    width: 140
  },
  {
    label: '类型',
    prop: 'typeDescr',
    align: 'center',
    sortable: 'custom',
    width: 100
  },
  {
    label: '区分数据权限',
    align: 'center',
    sortable: 'custom',
    width: 160,
    isSlot: true,
    slotName: 'dataPermissionLimit'
  },
  {
    label: '操作',
    align: 'center',
    width: 100,
    isSlot: true,
    slotName: 'operate'
  }
]
export const searchItem = [
  {
    prop: 'descr',
    label: '参数描述',
    clearable: true
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
