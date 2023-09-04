<template>
  <div ref="appRef" class="container-box">
    <page-header :add-btn="true" :export-btn="true">
      <el-button v-permission="{ action: 'add' }" type="primary" class="top-button-box" @click="addOrgManage">
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
    </page-header>

    <search-top-form
      :search-form="searchObj.searchForm"
      :search-item="searchObj.searchItem"
      @handle-search="handleSearch"
      @handle-reset="handleReset"
      @re-count-table-height="getTableHeight"
    ></search-top-form>
    <scroll-tab
      v-model:scroll-val="searchObj.searchForm.companyCode"
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
      <template #companyCode="{ row }">
        {{ spliceCodeName(row.companyCode, row.companyName) }}
      </template>
      <template #organizationRelationTypeCode="{ row }">
        {{ spliceCodeName(row.organizationRelationTypeCode, row.organizationRelationTypeCodeDescr) }}
      </template>
      <template #parentOrganizationCode="{ row }">
        {{ spliceCodeName(row.parentOrganizationCode, row.parentOrganizationCodeDescr) }}
      </template>
      <template #organizationCode="{ row }">
        {{ spliceCodeName(row.organizationCode, row.organizationCodeDescr) }}
      </template>
      <template #createBy="{ row }">
        {{ spliceCodeName(row.createBy, row.createByDescr) }}
      </template>
      <template #updateBy="{ row }">
        {{ spliceCodeName(row.updateBy, row.updateByDescr) }}
      </template>
      <template #status="scoped">
        <el-switch v-model="scoped.row.status" @change="switchChange(scoped.row, scoped.$index)" />
      </template>
      <template #beginTime="{ row }">{{ formatDate(row.beginTime, true) }}</template>
      <template #endTime="{ row }">{{ formatDate(row.endTime, true) }}</template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" class="edit-btn" link @click="handleEdit(row)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
        </div>
      </template>
    </table-page-content>

    <add-component
      v-if="addObj.drawerVisible"
      :drawer-visible="addObj.drawerVisible"
      :date-time="addObj.date"
      :company-code="searchObj.searchForm.companyCode"
      :select-options="selectOpions"
      @cancel="cancelDrawer"
      @submit="saveDrawer"
    />

    <edit-component
      v-if="editObj.dialogVisible"
      :dialog-visible="editObj.dialogVisible"
      :date-time="addObj.date"
      :row-id="editObj.rowId"
      :company-code="searchObj.searchForm.companyCode"
      :select-options="selectOpions"
      @cancel="cancelDialog"
      @submit="saveDialog"
    />
  </div>
</template>

<script setup lang="ts" name="OrgRelationManage">
import { pageConfig } from '@/utils/config'
import { spliceCodeName, setDuringDate, formatDate } from '@/utils'
import { useTableHeight } from '@/hooks/tableHeight'
import { useProxy } from '@/utils/proxy'
import { tableHeaders, searchItem } from './config'
import { orgList, editStatusById, orgTypeList, getCompanyCode } from './api'
import { addComponent, editComponent } from './components'
import useScrollStore from '@/store/modules/scrollTab'
const scrollStore = useScrollStore()
const { appRef, getTableHeight, tableHeight } = useTableHeight()
const { proxy } = useProxy()
const searchObj = reactive({
  pageConfig: { ...pageConfig },
  searchItem,
  searchForm: {
    companyCode: '',
    organizationRelationTypeCode: '',
    organizationCodeAndName: ''
  }
})

const tableObj = reactive({
  loading: false,
  tableList: []
})
const { startDate, endDate } = setDuringDate(3)

const addObj = reactive({
  drawerVisible: false,
  date: {
    beginTime: startDate,
    endTime: endDate
  }
})

const editObj = reactive({
  dialogVisible: false,
  rowId: '',
  date: {
    beginTime: startDate,
    endTime: endDate
  }
})

const selectOpions = reactive({
  orgRelationTypeOptions: [] as TselectOptions[],
  companyOptions: [] as TselectOptions[]
})

/**切换企业信息 */
const handleTabChange = () => {
  searchObj.searchForm.organizationRelationTypeCode = ''
  getListData()
  getOrgType()
}

// 查询
const handleSearch = () => {
  getListData()
}

// 重置
const handleReset = () => {
  searchObj.searchForm.organizationRelationTypeCode = ''
  searchObj.searchForm.organizationCodeAndName = ''
  handleSearch()
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
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getListData()
}

const switchChange = (row: any, index: number) => {
  editStatusById(row.id, { status: row.status })
    .then((res) => {
      if (res.code === '200000') {
        proxy.$message.msgSuccess('修改成功')
        getListData()
      }
    })
    .catch(() => {
      // 修改失败 恢复初始状态
      getListData()
      // setTimeout(() => {
      //   ;(tableObj.tableList as Array<any>)[index].status = !row.status
      // }, 1000)
    })
}

const addOrgManage = () => {
  addObj.drawerVisible = true
}

const cancelDrawer = () => {
  addObj.drawerVisible = false
}

const saveDrawer = () => {
  addObj.drawerVisible = false
  getListData()
}

const handleEdit = (row: any) => {
  editObj.dialogVisible = true
  editObj.rowId = row.id
}

const cancelDialog = () => {
  editObj.dialogVisible = false
}

const saveDialog = () => {
  editObj.dialogVisible = false
  getListData()
}

const getListData = () => {
  tableObj.loading = true
  const param = {
    pageSize: searchObj.pageConfig.pageSize,
    pageIndex: searchObj.pageConfig.pageNum,
    ...searchObj.searchForm
  }
  orgList(param).then((res: any) => {
    tableObj.tableList = res.data
    searchObj.pageConfig.total = res.total
    tableObj.loading = false
  })
}

const getOrgType = async () => {
  const orgTypeRes = await orgTypeList({ companyCode: searchObj.searchForm.companyCode })
  selectOpions.orgRelationTypeOptions = orgTypeRes.data.map((item: any) => {
    item.code = item.organizationRelationTypeCode
    return item
  })
  searchObj.searchItem[0].selectOptions = selectOpions.orgRelationTypeOptions
}

const init = async () => {
  // 获取企业信息
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then(async (res: any) => {
      if (res.length > 0) {
        searchObj.searchForm.companyCode = res[0].companyCode
        selectOpions.companyOptions = res
        getListData()
        await getOrgType()
      }
    })
  } else {
    searchObj.searchForm.companyCode = scrollStore.companyList[0]?.companyCode || ''
    selectOpions.companyOptions = scrollStore.companyList
    getListData()
    await getOrgType()
  }
}
init()
</script>

<style lang="scss" scoped></style>
