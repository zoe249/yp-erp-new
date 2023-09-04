<template>
  <draw-component
    :drawer-visible="state.show"
    :size="500"
    title="选择组织"
    @close-drawer="handleClose"
    @save-drawer="handleSubmit"
  >
    <search-top-form
      class="search-form"
      :search-form="state.searchForm"
      :search-item="state.searchItem"
      :show-reset="false"
      @handle-search="handleSearch"
      @handle-reset="handleReset"
    ></search-top-form>
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableObj.tableHeaders"
      :table-height="'56vh'"
      :is-slot-num="false"
      :page-config="state.pageConfig"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
      @handle-row-click="handleCurrentChange"
    >
      <template #checkbox="{ row }">
        <section class="check-cricle">
          <span v-if="row.checkbox" class="show"></span>
          <span v-else class="hide"></span>
        </section>
      </template>
    </table-page-content>
  </draw-component>
</template>

<script setup lang="ts">
import { pageConfig } from '@/utils/config'
import { getOrgData } from '@/views/orgManagement/orgInfo/api'
const emit = defineEmits(['handleSure'])
const state = reactive({
  show: false,
  orgCode: '',
  orgCodeName: '',
  searchForm: { searchInfo: '', organizationType: '', companyCode: '' },
  searchItem: [
    {
      prop: 'searchInfo',
      label: '组织',
      placeholder: '请输入编码或名称'
    }
  ],
  pageConfig: { ...pageConfig }
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: [] as any,
  tableHeaders: [
    { prop: 'checkbox', align: 'center', label: '选择', width: 60, isSlot: true, slotName: 'checkbox' },
    { prop: 'organizationCode', align: 'center', label: '组织编码', width: 100 },
    { prop: 'name', align: 'center', label: '组织名称', width: 100 },
    { prop: 'organizationTypeDescr', align: 'center', label: '组织类型', width: 100 }
  ]
})
// 搜索
const handleSearch = () => {
  state.pageConfig.pageNum = 1
  getList()
}
const handleReset = () => {
  state.searchForm = {
    searchInfo: '',
    organizationType: '',
    companyCode: ''
  }
  handleSearch()
}
const getList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getOrgData<any>({
    ...state.searchForm,
    pageIndex: state.pageConfig.pageNum,
    pageSize: state.pageConfig.pageSize
  })
    .then((res) => {
      tableObj.tableList = res.data.map((item: any) => {
        item.checkbox = state.orgCode && item.organizationCode == state.orgCode ? true : false
        if (item.checkbox) state.orgCodeName = item.organizationCode + ' - ' + item.name
        return item
      })
      state.pageConfig.total = res.total
      tableObj.loading = false
    })
    .catch(() => {
      tableObj.loading = false
    })
}
// 点击表格行回调
const handleCurrentChange = (val: any | undefined) => {
  tableObj.tableList = tableObj.tableList.map((item: any) => {
    if (item.organizationCode == val.organizationCode) {
      item.checkbox = true
      state.orgCode = val.organizationCode
      state.orgCodeName = val.organizationCode + ' - ' + val.name
    } else {
      item.checkbox = false
    }
    return item
  })
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  state.pageConfig.pageSize = val
  state.pageConfig.pageNum = 1
  getList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  state.pageConfig.pageNum = val
  getList()
}
const handleSubmit = () => {
  emit('handleSure', { organizationCode: state.orgCode, organization: state.orgCodeName })
  handleClose()
}
const handleClose = () => {
  state.orgCode = ''
  state.orgCodeName = ''
  state.searchForm = { searchInfo: '', organizationType: '', companyCode: '' }
  state.pageConfig.pageNum = 1
  state.pageConfig.total = 0
  tableObj.tableList = []
  state.show = false
}
defineExpose({ state, getList })
</script>

<style lang="scss" scoped>
.check-cricle {
  display: flex;
  justify-content: center;
  .show {
    display: block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    border: 4px solid $mainColor;
  }
  .hide {
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #cccccc;
  }
}
</style>
