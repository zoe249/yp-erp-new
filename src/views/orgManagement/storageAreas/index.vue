<template>
  <div ref="appRef" class="container-box">
    <page-header :add-btn="true" :export-btn="true">
      <el-button
        v-permission="{ action: 'add' }"
        type="primary"
        class="top-button-box"
        @click="addStorageArea"
      >
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
    </page-header>
    <search-top-form
      :search-form="searchObj.searchForm"
      :search-item="searchObj.searchItem"
      @handle-search="handleSearch"
      @handle-reset="handleReset"
      @re-count-table-height="getTableHeight"
    />
    <scroll-tab
      v-model:scroll-val="searchObj.searchForm.companyCode"
      type="company"
      @tab-click="handleTabChange"
    ></scroll-tab>
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableHeaders"
      :table-height="tableHeight"
      :page-config="searchObj.pageConfig"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
    >
      <template #organizationCode="{ row }">
        {{ spliceCodeName(row.organizationCode, row.organizationCodeDescr) }}
      </template>
      <template #type="{ row }">
        {{ spliceCodeName(row.type, row.typeDescr) }}
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.status" @change="switchChange(row)" />
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" class="edit-btn" link @click="handleEdit(row)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
        </div>
      </template>
    </table-page-content>

    <edit-component
      v-if="editObj.dialogVisible"
      :dialog-visible="editObj.dialogVisible"
      :row-id="editObj.rowId"
      :company-options="editObj.companyOptions"
      :company-code="searchObj.searchForm.companyCode"
      @close="handleClose"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts" name="StorageAreas">
import { pageConfig } from '@/utils/config'
import { spliceCodeName } from '@/utils'
import { useProxy } from '@/utils/proxy'
import { useTableHeight } from '@/hooks/tableHeight'
import { userStatusDics, initSearchItem, DicsObj } from '@/hooks/dicsData'
import { tableHeaders, searchItem } from './config'
import { getList, editStatusById } from './api'
import editComponent from './components/edit.vue'
import useScrollStore from '@/store/modules/scrollTab'

const scrollStore = useScrollStore()
const { proxy } = useProxy()
const { appRef, getTableHeight, tableHeight } = useTableHeight()

/**
 * 搜索
 */
const searchObj = reactive({
  searchForm: {
    organizationCode: '',
    type: '',
    status: '' as undefined | string,
    companyCode: ''
  },
  searchItem,
  pageConfig: { ...pageConfig }
})

const tableObj = reactive({
  loading: false,
  tableList: []
})

const editObj = reactive({
  dialogVisible: false,
  companyOptions: [] as Array<any>,
  rowId: ''
})

const handleTabChange = () => {
  getListData()
}

/**
 * 搜索
 */
const handleSearch = () => {
  getListData()
}

/**
 * 充值
 */
const handleReset = () => {
  searchObj.searchForm = {
    organizationCode: '',
    type: '',
    status: undefined,
    companyCode: searchObj.searchForm.companyCode
  }
  getListData()
}

const switchChange = (row: any) => {
  editStatusById(row.id, { status: !!row.status }).then((res: any) => {
    if (res.code === '200000') {
      proxy.$message.msgSuccess('修改成功')
      setTimeout(() => getListData(), 1500)
    }
  })
}

/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getListData()
}
/**
 * 切换表格page-num
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getListData()
}

const addStorageArea = () => {
  editObj.rowId = ''
  editObj.dialogVisible = true
}

const handleEdit = (row: any) => {
  editObj.rowId = row.id
  editObj.dialogVisible = true
}

const handleClose = () => {
  editObj.dialogVisible = false
}

const handleSubmit = () => {
  editObj.dialogVisible = false
  getListData()
}

const getListData = () => {
  tableObj.loading = true
  const param: { status: string | boolean | undefined; [key: string]: unknown } = {
    pageSize: searchObj.pageConfig.pageSize,
    pageIndex: searchObj.pageConfig.pageNum,
    ...searchObj.searchForm
  }

  if (param.status !== '01' && param.status !== '02') {
    delete param.status
  } else {
    param.status = param.status === '01' ? true : false
  }
  getList(param).then((res: any) => {
    tableObj.tableList = res.data
    searchObj.pageConfig.total = res.total
    tableObj.loading = false
  })
}

const init = async () => {
  // 获取企业信息
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then((res: any) => {
      if (res.length > 0) {
        searchObj.searchForm.companyCode = res[0].companyCode
        editObj.companyOptions = res
        getListData()
      }
    })
  } else {
    searchObj.searchForm.companyCode = scrollStore.companyList[0]?.companyCode || ''
    editObj.companyOptions = scrollStore.companyList
    getListData()
  }

  searchObj.searchItem[2].selectOptions = userStatusDics as Array<any>
  searchObj.searchItem = await initSearchItem(searchObj.searchItem, { type: DicsObj.H002 })
}
init()
</script>

<style lang="scss" scoped></style>
