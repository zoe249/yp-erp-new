<template>
  <div ref="appRef" class="container-box">
    <page-header :search-form="searchObj.searchForm">
      <el-button type="primary" class="top-button-box" @click="handleView()">
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
    </page-header>
    <!-- 表格组件 -->
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableHeaders"
      :page-config="searchObj.pageConfig"
      :show-pager="tableObj.showPager"
      :table-height="tableHeight"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
    >
      <template #companyCode="{ row }">
        {{ spliceCodeName(row.companyCode, row.companyCodeDescr) }}
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" class="edit-btn" link @click="handleView(row)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
        </div>
      </template>
    </table-page-content>
    <edit-form
      ref="editRef"
      :dialog-visible="state.dialogVisible"
      :edit-id="state.applicationId"
      @handle-cancle="handleCancle"
      @handle-added="handleAdded"
    />
  </div>
</template>

<script setup lang="ts" name="Application">
import editForm from './components/edit.vue'
import { tableHeaders, editForm as editFormItem } from './config'
import { spliceCodeName } from '@/utils/index'
import { pageConfig } from '@/utils/config'
import useScrollStore from '@/store/modules/scrollTab'
import { useTableHeight } from '@/hooks/tableHeight'
import { useProxy } from '@/utils/proxy'
import { applcationList } from './api'
const { appRef, tableHeight } = useTableHeight()
const scrollStore = useScrollStore()
const { proxy } = useProxy()
// 搜索对象
const searchObj = reactive({
  searchForm: { descr: null },
  pageConfig: { ...pageConfig }
})
const state = reactive({
  funcName: 'DEPTID_LOCATION', // 组合查询字段

  searchForm: {
    mktid: [], // 门店编码
    deptid: '', // 柜组
    flagDep: '', //所属位置
    flagCancel: '', // 是否有效
    updateTime: '', // 修改时间
    customSearch: '', // 自定义查询
    customOrder: null
  },

  drawerVisible: false, // 是否显示组合查询

  tableHeaders, // 表头
  loading: false, // 是否记载
  tableData: [], // 表格数据
  pageConfig: {
    // 分页配置
    pageNum: 1,
    pageSize: 20,
    total: 0
  },

  dialogVisible: false, // 是否显示编辑框
  isAdd: false, // 编辑框是否新增

  editFormItem, // 编辑框表单
  mktidOptions: [], // 门店下拉选择
  applicationId: '', // 详情id
  nameState: false // 系统名称唯一性
})
const editRef = ref()
// 表格对象
const tableObj = reactive({
  loading: false,
  showPager: false,
  tableList: []
})
const getApplicationList = () => {
  applcationList(searchObj.pageConfig).then((res: any) => {
    console.log(res)
    tableObj.tableList = res.data
  })
}
const handleAdded = async () => {
  await getApplicationList()
  scrollStore.setSytemList(JSON.parse(JSON.stringify(tableObj.tableList)))
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
function pageSizeChange(val: number) {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
function currentPageChange(val: number) {
  searchObj.pageConfig.pageNum = val
}

// 查看详情
const handleView = (row?: any) => {
  console.log(row)
  if (row) {
    state.applicationId = row.id
    Object.keys(editRef.value.ruleForm).forEach((item, index) => {
      editRef.value.ruleForm[item] = row[item] ?? ''
    })
    state.dialogVisible = true
  } else {
    state.applicationId = ''
    state.dialogVisible = true
  }
}

// 取消
const handleCancle = () => {
  state.dialogVisible = false
}
if (!scrollStore.getCompany) {
  scrollStore.getCompanyList()
}
getApplicationList()
</script>

<style lang="scss" scoped></style>
