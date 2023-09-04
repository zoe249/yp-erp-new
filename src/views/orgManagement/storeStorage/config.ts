const defaultWidth = 100
import { storageStatus } from '@/hooks/dicsData'
export const searchItem = [
  {
    prop: 'organizationCode',
    label: '门店编码',
    placeholder: '请输入门店编码'
  },
  {
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    type: 'select',
    selectOptions: storageStatus
  }
]
export const tableHeaders = [
  {
    label: '门店',
    prop: 'organizationCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'organizationCode'
  },
  {
    label: '店铺',
    prop: 'storeCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'storeCode'
  },
  {
    label: '库区类型',
    prop: 'type',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'type'
  },
  {
    label: '库区编码',
    prop: 'storageAreaCode',
    align: 'center',
    width: defaultWidth,
    isSlot: true,
    slotName: 'storageAreaCode'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: defaultWidth
  },
  {
    label: '修改时间',
    prop: 'updateTime',
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
  }
]
