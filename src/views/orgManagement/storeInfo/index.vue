<template>
  <div ref="appRef" class="container-box">
    <page-header>
      <el-button
        v-permission="{ action: 'add' }"
        type="primary"
        class="top-button-box"
        @click="handleAdd('add')"
      >
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
      v-model:scroll-val="state.companyCode"
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
      <template #type="{ row }">
        <span>{{ spliceCodeName(row.type, row.typeDescr) }}</span>
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.status" @change="changeStatus(row.status, row.id)"></el-switch>
      </template>
      <template #necessary="{ row }">
        <el-checkbox v-model="row.necessary" disabled></el-checkbox>
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" link @click="handleAdd('edit', row.id)">
            <i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span>
          </el-button>
        </div>
      </template>
    </table-page-content>
    <!-- dialog组件 -->
    <add-form
      v-if="state.dialogVisible"
      :id="state.rowId"
      ref="addFormRef"
      :dialog-visible="state.dialogVisible"
      :title="state.title"
      :type-options="state.typeOptions"
      @close-dialog="state.dialogVisible = false"
      @refresh-list="getTableList"
    ></add-form>
  </div>
</template>

<script lang="ts" setup name="StoreInfo">
import addForm from './components/addForm.vue'
import { searchItem, tableHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { spliceCodeName } from '@/utils'
import { useTableHeight } from '@/hooks/tableHeight'
import { editStatus, getList } from './api'
import { getDicsList } from '@/hooks/dicsData'
import useScrollStore from '@/store/modules/scrollTab'
const scrollStore = useScrollStore()
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const addFormRef = ref<any>()
// 搜索对象
const searchObj = reactive({
  searchItem,
  searchForm: {
    store: null, // 店铺编码或店铺名称
    type: null
  },
  pageConfig: { ...pageConfig }
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: []
})
const state = reactive({
  companyCode: '',
  dialogVisible: false,
  title: '',
  rowId: null,
  typeOptions: [] as any
})
// 搜索
const handleSearch = () => {
  searchObj.pageConfig.pageNum = 1
  getTableList()
}
const handleReset = () => {
  searchObj.searchForm = {
    store: null,
    type: null
  }
  handleSearch()
}
// 获取列表数据
const getTableList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getList<any>({
    ...searchObj.searchForm,
    companyCode: state.companyCode,
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

// 修改店铺状态
const changeStatus = (val: boolean, id: string) => {
  editStatus<any>(id, { status: val })
    .then(() => {
      getTableList()
    })
    .catch(() => {
      getTableList()
    })
}
const pageSizeChange = (val: number) => {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getTableList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getTableList()
}

const handleAdd = (flag: string, id: any) => {
  state.dialogVisible = true
  if (flag === 'edit') {
    state.rowId = id
    state.title = '编辑店铺/详情'
  }
  if (flag === 'add') {
    state.rowId = null
    state.title = '新增店铺'
    nextTick(() => {
      addFormRef.value.state.formData.companyCode = state.companyCode
    })
  }
}
// 切换企业事件
const handleTabChange = () => {
  tableObj.tableList = []
  searchObj.pageConfig.pageNum = 1
  searchObj.pageConfig.total = 0
  getTableList()
}
// 初始化函数
const init = () => {
  // 获取企业信息
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then((res: any) => {
      if (res.length > 0) {
        state.companyCode = res[0].companyCode
        getTableList()
      }
    })
  } else {
    state.companyCode = scrollStore.companyList[0]?.companyCode || ''
    getTableList()
  }
  // 获取店铺类型
  getDicsList('H003').then((res: any) => {
    searchObj.searchItem[1].selectOptions = res as Array<any>
    state.typeOptions = res as Array<any>
  })
}
init()
</script>
