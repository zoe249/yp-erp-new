const defaultWidth = 100
export const tableHeaders = [
  {
    label: '账号',
    prop: 'userCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '姓名',
    prop: 'realName',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '所属组织',
    prop: 'organizationDescr',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '应用',
    prop: 'systemCodeDescr',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '字段名',
    prop: 'fieldName',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '有效期开始',
    prop: 'beginTime',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '有效期结束',
    prop: 'endTime',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: 120
  },
  {
    label: '创建者',
    prop: 'createByDescr',
    align: 'center',
    width: 140
  },
  {
    label: '修改时间',
    prop: 'updateTime',
    align: 'center',
    width: 120
  },
  {
    label: '修改者',
    prop: 'updateByDescr',
    align: 'center',
    width: 140
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
    prop: 'codeOrRealName',
    label: '账号'
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
