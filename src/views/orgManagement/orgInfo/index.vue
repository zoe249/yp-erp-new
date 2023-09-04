<template>
  <div ref="appRef" class="container-box org-info-view">
    <page-header>
      <el-button v-permission="{ action: 'add' }" type="primary" class="top-button-box" @click="handleAdd()">
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
    </page-header>
    <search-top-form
      class="search-form"
      :search-form="searchObj.searchForm"
      :search-item="searchObj.searchItem"
      @handle-search="handleSearch"
      @handle-reset="handleReset"
      @re-count-table-height="getTableHeight"
    ></search-top-form>
    <scroll-tab
      v-model:scroll-val="searchObj.companyCode"
      type="company"
      @tab-click="handleTabChange"
    ></scroll-tab>
    <!-- 表格组件 -->
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableHeaders"
      :table-height="tableHeight"
      :page-config="searchObj.pageConfig"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
    >
      <template #organizationType="{ row }">
        <span>{{ spliceCodeName(row.organizationType, row.organizationTypeDescr) }}</span>
      </template>
      <template #formats="{ row }">
        <span>{{ spliceCodeName(row.formats, row.formatsDescr) }}</span>
      </template>
      <template #closeFlag="{ row }">
        <el-checkbox v-model="row.closeFlag" disabled></el-checkbox>
      </template>
      <template #managementForms="{ row }">
        <el-checkbox v-model="row.managementForms" disabled></el-checkbox>
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.status" @change="changeStatus(row.id, 'status', row.status)"></el-switch>
      </template>
      <template #address="{ row }">
        <span>
          {{
            `${row.state || ''}${row.city || ''}${row.district || ''}${row.street || ''}${
              row.address || ''
            }` || ''
          }}
        </span>
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" link @click="handleAdd(row.id)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
        </div>
      </template>
    </table-page-content>
    <add-component
      ref="addRef"
      :org-list="searchObj.searchItem[1].selectOptions"
      :formats-list="searchObj.searchItem[2].selectOptions"
      @handle-added="getList()"
    ></add-component>
  </div>
</template>

<script setup lang="ts">
import { searchItem, tableHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { useTableHeight } from '@/hooks/tableHeight'
import { spliceCodeName } from '@/utils/index'
import { initSearchItem, DicsObj } from '@/hooks/dicsData'
import { getOrgData, updateOrgStatus } from './api'
import useScrollStore from '@/store/modules/scrollTab'
import { useProxy } from '@/utils/proxy'
import addComponent from './components/index.vue'
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const { proxy } = useProxy()
const addRef = ref()
const scrollStore = useScrollStore()
const searchObj = reactive({
  companyCode: '',
  searchForm: { seachInfo: '', organizationType: '', formats: '' },
  searchItem,
  pageConfig
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: []
})
// 搜索
const handleSearch = () => {
  searchObj.pageConfig.pageNum = 1
  getList()
}
const handleReset = () => {
  searchObj.searchForm = {
    seachInfo: '',
    organizationType: '',
    formats: ''
  }
  handleSearch()
}
// 切换企业
const handleTabChange = () => {
  searchObj.pageConfig.pageNum = 1
  getList()
}
// 获取列表数据
const getList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getOrgData<any>({
    ...searchObj.searchForm,
    companyCode: searchObj.companyCode,
    pageIndex: searchObj.pageConfig.pageNum,
    pageSize: searchObj.pageConfig.pageSize
  })
    .then((res) => {
      tableObj.tableList = res.data
      searchObj.pageConfig.total = res.total
      tableObj.loading = false
    })
    .catch(() => {
      tableObj.loading = false
    })
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getList()
}
// 修改状态
const changeStatus = async (id: string, type: string, val: unknown) => {
  const params = {} as any
  if (type == 'status') {
    params.status = val
  }
  updateOrgStatus(id, params)
    .then(() => {
      proxy.$message.msgSuccess('修改组织信息成功')
      getList()
    })
    .catch(() => {
      getList()
    })
}
// 新增
const handleAdd = async (id?: string) => {
  if (id) {
    addRef.value.state.currEditId = id
    await addRef.value.getDetail()
  }
  addRef.value.state.companyCode = searchObj.companyCode
  addRef.value.state.show = true
}
// 初始化
const init = async () => {
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then((res: any) => {
      if (res.length > 0) {
        searchObj.companyCode = res[0].companyCode
      }
      getList()
    })
  } else {
    searchObj.companyCode = scrollStore.companyList[0]?.companyCode || ''
    getList()
  }
  searchObj.searchItem = await initSearchItem(searchObj.searchItem, {
    organizationType: DicsObj.H001,
    formats: DicsObj.S001
  })
}
init()
</script>

<style lang="scss" scoped></style>
