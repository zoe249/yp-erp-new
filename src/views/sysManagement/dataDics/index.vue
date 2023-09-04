<template>
  <div ref="appRef" class="container-box">
    <page-header> </page-header>
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
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" link @click="handleAdd(row.code)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
        </div>
      </template>
    </table-page-content>
  </div>
  <dics-table ref="dicsRef"></dics-table>
</template>

<script setup lang="ts" name="dataDics">
import { searchItem, tableHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { useTableHeight } from '@/hooks/tableHeight'
import { getDicsList } from './api'
import { useProxy } from '@/utils/proxy'
import dicsTable from './components/index.vue'
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const { proxy } = useProxy()
const dicsRef = ref()
// 搜索对象
const searchObj = reactive({
  searchForm: { code: null, name: null },
  pageConfig: { ...pageConfig },
  searchItem
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
  searchObj.searchForm = { code: null, name: null }
  handleSearch()
}
// 获取列表数据
const getList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getDicsList<any>({
    ...searchObj.searchForm,
    pageIndex: searchObj.pageConfig.pageNum,
    pageSize: searchObj.pageConfig.pageSize
  })
    .then((res) => {
      tableObj.tableList = res.data.data
      searchObj.pageConfig.total = res.data.total
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
// 查看项值详情
const handleAdd = (id: string) => {
  dicsRef.value.state.id = id
  dicsRef.value.getList()
  dicsRef.value.state.show = true
}
// 初始化函数
const init = () => {
  getList()
}
init()
</script>

<style lang="scss" scoped></style>
