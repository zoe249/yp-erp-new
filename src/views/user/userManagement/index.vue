<template>
  <div ref="appRef" class="container-box">
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
      <template #userType="{ row }">
        <span>{{ spliceCodeName(row.userType, row.userTypeDescr) }}</span>
      </template>
      <template #status="{ row }">
        <span>{{ spliceCodeName(row.status, row.statusDescr) }}</span>
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" link @click="handleAdd(row.id)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
          <el-button v-permission="{ action: 'edit' }" link @click="resetPwd(row.id)"
            ><i class="iconfont icon-reset1"></i><span class="text">重置密码</span></el-button
          >
        </div>
      </template>
    </table-page-content>
    <add-component
      ref="addRef"
      :user-type-dics="searchObj.userTypeDics"
      :sex-dics="sexDics"
      :org-dics="searchObj.orgDics"
      :position-dics="searchObj.positionDics"
      :system-role-list="searchObj.systemRoleList"
      @handle-added="getList()"
    ></add-component>
  </div>
</template>

<script setup lang="ts" name="UserManagement">
import { searchItem, tableHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { spliceCodeName } from '@/utils/index'
import { useTableHeight } from '@/hooks/tableHeight'
import { DicsObj } from '@/hooks/dicsData'
import addComponent from './components/index.vue'
import useScrollStore from '@/store/modules/scrollTab'
import { getOrgList } from '@/views/orgManagement/orgInfo/api'
import { getUserMList, getSystemRole, resetPwdById } from './api'
import { getDicsList, userTypeDics, sexDics } from '@/hooks/dicsData'
import { useProxy } from '@/utils/proxy'
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const addRef = ref()
const { proxy } = useProxy()
const scrollStore = useScrollStore()
// 搜索对象
const searchObj = reactive({
  companyCode: '',
  searchForm: { codeOrRealName: null, organizationCode: null, phone: null, status: null, userType: null },
  pageConfig: { ...pageConfig },
  searchItem,
  orgDics: [],
  positionDics: [],
  userTypeDics: userTypeDics.filter((v) => v.code != '2'),
  systemRoleList: []
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
    codeOrRealName: null,
    organizationCode: null,
    phone: null,
    status: null,
    userType: null
  }
  handleSearch()
}
// 切换企业
const handleTabChange = () => {
  searchObj.pageConfig.pageNum = 1
  getList()
  getOrgOptions()
}
// 获取列表数据
const getList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getUserMList<any>({
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
const getOrgOptions = () => {
  getOrgList<any>({
    companyCode: searchObj.companyCode
  })
    .then((res) => {
      searchObj.searchItem[1].selectOptions = res.data.map((v: any) => ({
        code: v.organizationCode,
        name: v.organizationName
      }))
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
// 查看详情/新增
const handleAdd = (id?: string) => {
  if (id) {
    addRef.value.state.userId = id
    addRef.value.getDetail()
  }
  addRef.value.state.formData.companyCode = searchObj.companyCode
  addRef.value.state.show = true
}
// 重置密码
const resetPwd = (id: string) => {
  proxy.$message.confirm('确定要将密码修改成初始密码吗？').then(async () => {
    await resetPwdById(id)
    proxy.$message.msgSuccess('重置成功')
    getList()
  })
}
// 初始化函数
const init = () => {
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then((res: any) => {
      if (res.length > 0) {
        searchObj.companyCode = res[0].companyCode
      }
      getList()
      getOrgOptions()
    })
  } else {
    searchObj.companyCode = scrollStore.companyList[0]?.companyCode || ''
    getList()
    getOrgOptions()
  }
  getDicsList(DicsObj.H001).then((res: any) => {
    searchObj.orgDics = res
  })
  getDicsList(DicsObj.S005).then((res: any) => {
    searchObj.positionDics = res
  })
  getSystemRole().then((res: any) => {
    searchObj.systemRoleList = res.data || []
  })
}
init()
</script>

<style lang="scss" scoped></style>
