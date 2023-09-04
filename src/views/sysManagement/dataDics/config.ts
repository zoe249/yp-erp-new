const defaultWidth = 100
export const tableHeaders = [
  {
    label: '类型编码',
    prop: 'code',
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
    label: '项值',
    align: 'center',
    width: 120,
    isSlot: true,
    fixed: 'right',
    showTooltip: false,
    slotName: 'operate'
  }
]
export const tableItemHeaders = [
  {
    label: '类型编码',
    prop: 'ddCode',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '项值标识',
    prop: 'code',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '项值名称',
    prop: 'name',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '是否有效',
    prop: 'status',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'status'
  }
]
export const searchItem = [
  {
    prop: 'code',
    label: '类型编码'
  },
  {
    prop: 'name',
    label: '类型名称'
  }
]
