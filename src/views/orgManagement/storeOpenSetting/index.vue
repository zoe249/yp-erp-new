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
      @refresh-list="getTableList"
    >
      <template #organizationCode="{ row }">
        <span>{{ spliceCodeName(row.organizationCode, row.organizationCodeDescr) }}</span>
      </template>
      <template #type="{ row }">
        <span>{{ spliceCodeName(row.type, row.typeDescr) }}</span>
      </template>
      <template #storeCode="{ row }">
        <span>{{ spliceCodeName(row.storeCode, row.name) }}</span>
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.status" @change="changeStatusById(row.id, row.status)"></el-switch>
      </template>
      <template #operatingStatus="{ row }">
        <span>{{ spliceCodeName(row.operatingStatus, row.operatingStatusDescr) }}</span>
      </template>
      <template #durationType="{ row }">
        <span>{{ spliceCodeName(row.durationType, row.durationTypeDescr) }}</span>
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button
            v-permission="{ action: 'edit' }"
            link
            @click="handleAdd('edit', row.id, row.companyCode)"
          >
            <i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span>
          </el-button>
        </div>
      </template>
    </table-page-content>
    <add-form
      v-if="state.drawervisible"
      :id="state.rowId"
      ref="addFormRef"
      :user-info="userInfo"
      :drawer-visible="state.drawervisible"
      :type-options="state.typeOptions"
      :title="state.title"
      @refresh-list="getTableList"
      @close-drawer="state.drawervisible = false"
    ></add-form>
  </div>
</template>

<script lang="ts" setup name="StoreOpenSetting">
import AddForm from './components/AddForm.vue'
import { searchItem, tableHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { spliceCodeName } from '@/utils'
import { useTableHeight } from '@/hooks/tableHeight'
import { changeStatus, getList } from './api'
import { getDicsList } from '@/hooks/dicsData'
import useScrollStore from '@/store/modules/scrollTab'
import useUserStore from '@/store/modules/user'

const scrollStore = useScrollStore()
const userInfo = useUserStore().userInfo // 获取缓存里的用户信息
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const addFormRef = ref<any>()
// 搜索对象
const searchObj = reactive({
  searchItem,
  searchForm: {
    code: null,
    type: null,
    store: null,
    operatingStatus: null
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
  title: '',
  rowId: '',
  typeOptions: [] as any,
  drawervisible: false
})
// 搜索
const handleSearch = () => {
  searchObj.pageConfig.pageNum = 1
  getTableList()
}
const handleReset = () => {
  searchObj.searchForm = {
    code: null,
    type: null,
    store: null,
    operatingStatus: null
  }
  handleSearch()
}
const changeStatusById = (id: string, val: boolean) => {
  changeStatus<any>(id, { status: val })
    .then(() => {
      getTableList()
    })
    .catch(() => {
      getTableList()
    })
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

const handleAdd = (flag: string, id: any, companyCode?: string) => {
  state.drawervisible = true
  if (flag === 'edit') {
    state.rowId = id
    nextTick(() => {
      addFormRef.value.state.formData.companyCode = companyCode
    })
    if (userInfo.headQuartersFlag) {
      state.title = '总部人员-编辑店铺营业设置/详情'
    } else {
      state.title = '门店人员-编辑店铺营业设置/详情'
    }
  } else if (flag === 'add') {
    state.rowId = ''
    nextTick(() => {
      addFormRef.value.state.formData.companyCode = state.companyCode
    })
    if (userInfo.headQuartersFlag) {
      state.title = '总部人员-新增店铺营业设置'
    } else {
      state.title = '门店人员-新增店铺营业设置'
    }
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
  // 获取店铺类型选项
  getDicsList('H003').then((res: any) => {
    searchObj.searchItem[1].selectOptions = res as Array<any>
    state.typeOptions = res as Array<any>
  })
  // 获取营业状态选项
  getDicsList('H005').then((res: any) => {
    searchObj.searchItem[3].selectOptions = res as Array<any>
  })
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
}
init()
</script>
