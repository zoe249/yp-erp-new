<template>
  <div ref="appRef" class="container-box">
    <page-header :add-btn="true" :export-btn="true" :search-form="searchObj.searchForm">
      <el-button v-permission="{ action: 'add' }" type="primary" class="top-button-box" @click="addData">
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
      <template #organizationCode="{ row }">
        {{ spliceCodeName(row.organizationCode, row.organizationCodeDescr) }}
      </template>
      <template #systemCode="{ row }">
        {{ spliceCodeName(row.systemCode, row.systemCodeDescr) }}
      </template>
      <template #function="{ row }">
        {{ spliceCodeName(row.function, row.functionDescr) }}
      </template>
      <template #dimension="{ row }">
        {{ spliceCodeName(row.dimension, row.dimensionDescr) }}
      </template>
      <template #beginTime="{ row }">
        {{ formatDate(row.beginTime, true) }}
      </template>
      <template #endTime="{ row }">
        {{ formatDate(row.endTime, true) }}
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" class="edit-btn" link @click="handleEdit(row)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
          <el-button v-permission="{ action: 'remove' }" class="delete-btn" link @click="handleDelete(row)"
            ><i class="iconfont icon-tubiaozhizuomoban"></i><span class="text">删除</span></el-button
          >
        </div>
      </template>
    </table-page-content>

    <data-component
      v-if="drawerObj.drawerVisible"
      :drawer-visible="drawerObj.drawerVisible"
      :row-id="drawerObj.rowId"
      :date-time="drawerObj.dateTime"
      @cancel="cancelDrawer"
      @submit="saveDrawer"
    ></data-component>
  </div>
</template>

<script setup lang="ts" name="Data">
import { searchItem, tableHeaders } from './config'
import { dataList, systemList, deleteDataById } from './api'
import { pageConfig } from '@/utils/config'
import { setDuringDate, spliceCodeName, formatDate } from '@/utils'
import { useTableHeight } from '@/hooks/tableHeight'
import dataComponent from './components/edit.vue'
import { useProxy } from '@/utils/proxy'
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const { proxy } = useProxy()
// 搜索对象
const searchObj = reactive({
  searchForm: {
    codeOrRealName: '',
    systemCode: ''
  },
  pageConfig: { ...pageConfig, pageIndex: 1 },
  searchItem
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: [] as any[] | undefined
})
const { startDate, endDate } = setDuringDate()
const drawerObj = reactive({
  drawerVisible: false,
  rowId: '',
  dateTime: {
    beginTime: startDate,
    endTime: endDate
  }
})

// 查询
const handleSearch = () => {
  getListData()
}

// 重置
const handleReset = () => {
  searchObj.searchForm = { codeOrRealName: '', systemCode: '' }
  handleSearch()
}

const getListData = () => {
  tableObj.tableList = []
  tableObj.loading = true
  const pageParam = {
    pageIndex: searchObj.pageConfig.pageIndex,
    pageSize: searchObj.pageConfig.pageSize,
    ...searchObj.searchForm
  }
  dataList(pageParam).then((res) => {
    tableObj.tableList = res.data as any[]
    searchObj.pageConfig.total = res.total
  })
  tableObj.loading = false
}
getListData()
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
function pageSizeChange(val: number) {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageIndex = 1
  getListData()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
function currentPageChange(val: number) {
  searchObj.pageConfig.pageNum = val
  getListData()
}

// 取消
const cancelDrawer = () => {
  drawerObj.drawerVisible = false
}

// 保存
const saveDrawer = (editForm: any) => {
  drawerObj.drawerVisible = false
  getListData()
}

/**
 * 编辑单条内容
 * @param row 行内容
 */
const handleEdit = (row: any) => {
  drawerObj.drawerVisible = true
  drawerObj.rowId = row.id
}

/**
 * 删除单条内容
 * @param {any} row 行内容
 */
const handleDelete = (row: any) => {
  proxy.$message.confirm('确定要删除该信息?').then(() => {
    deleteDataById(row.id).then((res) => {
      // console.log(res)
      if (res.code === '200000') {
        proxy.$message.msgSuccess('删除成功')
      }
      getListData()
    })
  })
}

// 新增角色
const addData = () => {
  drawerObj.rowId = ''
  drawerObj.drawerVisible = true
}

const init = () => {
  systemList().then((res) => {
    searchObj.searchItem[1].selectOptions = res.data as Array<any>
  })
}
init()
</script>

<style lang="scss" scoped></style>
