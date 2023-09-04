const defaultWidth = 100
// index 表头
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
    prop: 'organizationCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'organizationCode'
  },
  {
    label: '应用',
    prop: 'systemCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'systemCode'
  },
  {
    label: '菜单目录',
    prop: 'permissionDescr',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '功能',
    prop: 'function',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'function'
  },
  {
    label: '筛选维度',
    prop: 'dimension',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'dimension'
  },
  {
    label: '有效期开始',
    prop: 'beginTime',
    align: 'center',
    width: 120,
    isSlot: true,
    slotName: 'beginTime'
  },
  {
    label: '有效期结束',
    prop: 'endTime',
    align: 'center',
    width: 140,
    isSlot: true,
    slotName: 'endTime'
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
    // isSlot: true,
    // slotName: 'updateBy'
  },
  {
    label: '操作',
    align: 'center',
    width: 180,
    isSlot: true,
    slotName: 'operate'
  }
]
// index 搜索框
export const searchItem = [
  {
    prop: 'codeOrRealName',
    label: '账号'
  },
  {
    prop: 'systemCode',
    label: '应用系统',
    type: 'select',
    selectOptions: [] as Array<any>
  }
]

// 筛选维度
export const dimensionConfig = [
  {
    id: 1,
    ddCode: '01',
    name: '管理区域',
    formatValue: '01-管理区域'
  },
  {
    id: 2,
    ddCode: '02',
    name: '单个组织',
    formatValue: '02-单个组织'
  },
  {
    id: 3,
    ddCode: '03',
    name: '门店店铺',
    formatValue: '03-门店店铺'
  }
]

// 组织信息配置
export const orgHeaders = [
  {
    prop: 'organizationCode',
    label: '组织编码'
  },
  {
    prop: 'name',
    label: '组织名称'
  },
  {
    prop: 'organizationTypeDescr',
    label: '组织类型'
  }
]

// 门店店铺配置
export const storeHeaders = [
  {
    label: '门店编码',
    prop: 'organizationCode',
    isSlot: true,
    slotName: 'organizationCode'
  },
  {
    label: '店铺类型',
    prop: 'type',
    isSlot: true,
    slotName: 'type'
  },
  {
    label: '店铺',
    prop: 'storeCode',
    isSlot: true,
    slotName: 'storeCode'
  },
  {
    label: '营业状态',
    prop: 'operatingStatus',
    isSlot: true,
    slotName: 'operatingStatus'
  },
  {
    label: '经营时间类型',
    prop: 'durationType',
    isSlot: true,
    slotName: 'durationType'
  }
]
