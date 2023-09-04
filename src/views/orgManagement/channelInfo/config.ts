const defaultWidth = 100
export const tableHeaders = [
  {
    label: '渠道编码',
    prop: 'channelsCode',
    width: defaultWidth,
    align: 'left'
  },
  {
    label: '渠道名称',
    prop: 'name',
    width: defaultWidth,
    align: 'center'
  },

  {
    label: '父级渠道',
    prop: 'parentChannelsCode',
    width: defaultWidth,
    align: 'center',
    isSlot: true,
    slotName: 'parentChannelsCode'
  },
  {
    label: '状态',
    prop: 'status',
    width: defaultWidth,
    align: 'center',
    isSlot: true,
    slotName: 'status'
  },
  {
    label: '操作',
    align: 'center',
    width: 160,
    isSlot: true,
    fixed: 'right',
    showTooltip: false,
    slotName: 'operate'
  }
]
export const searchItem = [
  {
    prop: 'channelsCode',
    label: '渠道编码'
  },
  {
    prop: 'name',
    label: '名称'
  }
]
