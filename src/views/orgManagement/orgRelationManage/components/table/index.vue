<template>
  <div class="trans-wrap">
    <div class="flex-line">
      <label class="red-text">{{ searchTip }}</label>
      <el-input
        v-model="state.searchInfo.searchInfo"
        class="search-input-box"
        clearable
        @keyup.enter="doSearch"
        @clear="doSearch"
      ></el-input>
    </div>

    <div class="trans-content">
      <div class="trans-content-source">
        <el-table
          ref="multipleTableRef"
          header-align="center"
          row-key="id"
          :data="state.sourceData"
          :header-cell-style="EltableHeaderStyle"
          :height="360"
          @selection-change="handleSelectionChange"
          @select-all="handleSelectAll"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55" />
          <el-table-column
            v-for="(item, index) in transOrgHeaders"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :align="item.align || 'center'"
            :min-width="item.width"
            :resizable="true"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row[item.prop] || '' }}
            </template>
          </el-table-column>
        </el-table>
        <div v-if="state.total > state.searchInfo.pageSize" class="pagination-box">
          <el-pagination
            :current-page="state.searchInfo.pageIndex"
            :page-size="state.searchInfo.pageSize"
            :total="state.total"
            background
            small
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      <dic class="trans-content-target">
        <transfer-table
          ref="tranferRef"
          :selected-data="state.selectedData"
          :props-key="state.propsKey"
          @revert-selected-row="revertSelectedRow"
          @clear-all-rows="clearAllRows"
        />
      </dic>
    </div>
  </div>
</template>

<script setup lang="ts">
import { transOrgHeaders } from '../../config'
import { orgListInfo } from '../../api'
import transferTable from './transferTable.vue'
import { ElTable } from 'element-plus'
const props = defineProps({
  searchTip: {
    type: String,
    default: ''
  },
  companyCode: {
    type: String,
    default: ''
  }
})
const state = reactive({
  sourceData: [],
  searchInfo: {
    searchInfo: '',
    pageIndex: 1,
    pageSize: 8
  },
  total: 0,

  selectedData: [] as Array<any>,
  propsKey: 'organizationCode'
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const tranferRef = ref<InstanceType<typeof transferTable>>()

// 表头样式
const EltableHeaderStyle = {
  backgroundColor: '#EDF3FF',
  color: '#333333',
  fontSize: '14px',
  fontWeight: 500
}

const handleSelectionChange = (val: Array<any>) => {
  state.selectedData = val
  tranferRef.value?.selectChange(state.selectedData)
}
const handleSelectAll = (val: Array<any>) => {
  state.selectedData = val
}
const doSearch = () => {
  getOrgList()
}
const handlePageChange = (val: number) => {
  state.searchInfo.pageIndex = val
  getOrgList()
}

/**
 * 取消选中
 */
const revertSelectedRow = (row: any) => {
  nextTick(() => multipleTableRef.value?.toggleRowSelection(row, false))
}
/**
 * 清空
 */
const clearAllRows = (selectData: Array<any>) => {
  selectData.forEach((row: any) => {
    nextTick(() => multipleTableRef.value?.toggleRowSelection(row, false))
  })
}

/** 分页获取组织列表 */
const getOrgList = () => {
  orgListInfo({ ...state.searchInfo, companyCode: props.companyCode }).then((res: any) => {
    state.sourceData = res.data
    state.total = res.total
  })
}

/**
 * 批量获取组织编码
 */
const getSelectData = (): Array<string> => {
  const orgCodeList: Array<string> = []
  const tableDataAll = tranferRef.value?.state.tableDataAll
  tableDataAll && tableDataAll.forEach((item: any) => orgCodeList.push(item.organizationCode))
  return orgCodeList
}

const init = () => {
  getOrgList()
}
init()

defineExpose({ getSelectData })
</script>

<style lang="scss" scoped>
.trans-wrap {
  padding-top: 20px;

  .search-input-box {
    width: 280px;
  }
  .red-text {
    color: #ff554e;
    font-size: 14px;
  }
  .trans-content {
    margin-top: 30px;

    display: flex;
    justify-content: space-around;
    // width: 800px;
    // width: 100%;
    &-source {
      margin-right: 20px;
    }
  }
  .pagination-box {
    margin-top: 20px;
  }
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #f2f2f2 !important;
}
</style>
