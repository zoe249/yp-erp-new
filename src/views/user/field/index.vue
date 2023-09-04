<template>
  <div ref="appRef" class="container-box">
    <page-header :add-btn="true" :export-btn="true" :search-form="state.searchForm">
      <el-button type="primary" class="top-button-box" @click="insertEvent()">
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

    <edit-form
      ref="editRef"
      :dialog-visible="state.dialogVisible"
      :is-add="state.isAdd"
      :edit-form="tableObj.editinfoForm"
      :application-list="state.applicationList"
      @cancel-dialog="cancelDialog"
      @save-dialog="saveDialog"
      @handle-cancle="handleCancle"
    />
  </div>
</template>

<script setup lang="ts" name="Field">
import editForm from './components/edit.vue'
import { searchItem, tableHeaders, editForm as editFormItem } from './config'
import { pageConfig } from '@/utils/config'
import { useTableHeight } from '@/hooks/tableHeight'
import { fieldList, fieldLInfo, deleteField, applcationList, addField, editField } from './api'
import { formatDate } from '@/utils/index'
import { dayjs } from 'element-plus'
import { useProxy } from '@/utils/proxy'
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const { proxy } = useProxy()
// 搜索对象
const searchObj = reactive({
  searchForm: { codeOrRealName: null },
  pageConfig: { ...pageConfig },
  searchItem
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: [],
  editinfoForm: {}
})
// 弹窗表单对象
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

  searchItem, // 搜索项配置

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
  fieldId: '',
  applicationList: []
})

onMounted(() => {
  getListData()
})

const getListData = () => {
  let info = {
    pageIndex: searchObj.pageConfig.pageNum,
    pageSize: searchObj.pageConfig.pageSize,
    codeOrRealName: searchObj.searchForm.codeOrRealName
  }
  console.log(searchObj.searchForm)
  fieldList(info).then((res: any) => {
    console.log(res)
    res.data.forEach((item: any) => {
      item.beginTime = item.beginTime.slice(0, 11)
      item.endTime = item.endTime.slice(0, 11)
    })
    tableObj.tableList = res.data
    searchObj.pageConfig.total = res.total
  })
}

// 查询
const handleSearch = () => {
  searchObj.pageConfig.pageNum = 1
  getListData()
}

const handleReset = () => {
  searchObj.searchForm = { codeOrRealName: null }
  getListData()
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
function pageSizeChange(val: number) {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getListData()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
function currentPageChange(val: number) {
  searchObj.pageConfig.pageNum = val
}

// 取消
const cancelDialog = () => {
  state.dialogVisible = false
}

// 保存
const saveDialog = (editForm: any) => {
  console.log(editForm)
  if (state.isAdd) {
    // 新增
    addFieldInfo(editForm)
  } else {
    // 修改
    editFieldInfo(editForm)
  }
}

// 新增保存
const addFieldInfo = (editForm: any) => {
  let info = {
    userCode: editForm.userCode,
    systemCode: editForm.systemCode,
    fieldName: editForm.fieldName,
    beginTime: editForm.beginTime,
    endTime: editForm.endTime
  }
  addField(info).then((res: any) => {
    console.log(res)
    if (res.code == '200000') {
      proxy.$message.msgSuccess('新增成功')
      state.dialogVisible = false
      getListData()
    }
  })
}

// 修改保存
const editFieldInfo = (editForm: any) => {
  let info = {
    fieldName: editForm.fieldName,
    beginTime: editForm.beginTime,
    endTime: editForm.endTime
  }
  editField(state.fieldId, info).then((res: any) => {
    console.log(res)
    if (res.code == '200000') {
      proxy.$message.msgSuccess('修改成功')
      state.dialogVisible = false
      getListData()
    }
  })
}

// 新增
const insertEvent = () => {
  tableObj.editinfoForm = {
    beginTime: formatDate(new Date(), true),
    endTime: dayjs().add(50, 'year').format('YYYY-MM-DD')
  }
  state.isAdd = true
  getApplicationList()
}

// 查看详情
const handleEdit = (row: any) => {
  console.log(row)
  state.fieldId = row.id
  state.isAdd = false
  getApplicationList()
  fieldLInfo(row.id).then((res: any) => {
    console.log(res)
    res.data.beginTime = res.data.beginTime.slice(0, 11)
    res.data.endTime = res.data.endTime.slice(0, 11)
    tableObj.editinfoForm = res.data
    state.dialogVisible = true
  })
}

// 删除
const handleDelete = (row: any) => {
  proxy.$message.confirm('确定要删除该信息?').then(() => {
    deleteField(row.id).then((res) => {
      // console.log(res)
      if (res.code === '200000') {
        proxy.$message.msgSuccess('删除成功')
      }
      getListData()
    })
  })
}

const handleCancle = () => {
  state.dialogVisible = false
}

// 获取应用列表
const getApplicationList = () => {
  applcationList().then((res: any) => {
    console.log(res)
    state.applicationList = res.data
    state.dialogVisible = true
  })
}
</script>

<style lang="scss" scoped></style>
