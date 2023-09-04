<template>
  <div ref="appRef" class="container-box">
    <page-header :add-btn="true" :export-btn="true">
      <el-button v-permission="{ action: 'add' }" type="primary" class="top-button-box" @click="addCompany">
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
    </page-header>

    <!-- 表格组件 -->
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableData"
      :table-headers="tableHeaders"
      :table-height="tableHeight"
      :page-config="searchObj.pageConfig"
      :show-pager="false"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
    >
      <template #status="scoped">
        <el-switch v-model="scoped.row.status" @change="switchChange(scoped.row, scoped.$index)" />
      </template>
      <template #createBy="{ row }">
        {{ spliceCodeName(row.createBy, row.createByDescr) }}
      </template>
      <template #updateBy="{ row }">
        {{ spliceCodeName(row.updateBy, row.updateByDescr) }}
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
      @close="cancelDialog"
      @submit="saveDialog"
    />
  </div>
</template>

<script setup lang="ts" name="Company">
import { pageConfig } from '@/utils/config'
import { spliceCodeName } from '@/utils'
import { useTableHeight } from '@/hooks/tableHeight'
import { tableHeaders } from './config'
import { companyList, editStatusById } from './api'
import editComponent from './components/edit.vue'
const { appRef, getTableHeight, tableHeight } = useTableHeight()
import useScrollStore from '@/store/modules/scrollTab'
import { useProxy } from '@/utils/proxy'
import { json } from 'stream/consumers'
const scrollStore = useScrollStore()
const { proxy } = useProxy()
const searchObj = reactive({
  pageConfig: { ...pageConfig }
})

const tableObj = reactive({
  loading: false,
  tableData: []
})

const editObj = reactive({
  dialogVisible: false,
  rowId: ''
})

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
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getListData()
}

const addCompany = () => {
  editObj.dialogVisible = true
  editObj.rowId = ''
}

const switchChange = (row: any, index: number) => {
  editStatusById(row.id)
    .then((res) => {
      if (res.code === '200000') {
        proxy.$message.msgSuccess('修改成功')
        getListData()
      }
    })
    .catch(() => {
      // 修改失败 恢复初始状态
      setTimeout(() => {
        getListData()
      }, 1000)
    })
}

const handleEdit = (row: any) => {
  editObj.dialogVisible = true
  editObj.rowId = row.id
}

const cancelDialog = () => {
  editObj.dialogVisible = false
}

const saveDialog = async () => {
  editObj.dialogVisible = false
  await getListData()
  scrollStore.setCompanyList(JSON.parse(JSON.stringify(tableObj.tableData)))
}

const getListData = () => {
  tableObj.loading = true
  const param = {
    pageSize: searchObj.pageConfig.pageSize,
    pageIndex: searchObj.pageConfig.pageNum
  }
  companyList().then((res: any) => {
    tableObj.tableData = res
    searchObj.pageConfig.total = res.total
    tableObj.loading = false
  })
  tableObj.loading = false
}
getListData()
</script>

<style lang="scss" scoped></style>
