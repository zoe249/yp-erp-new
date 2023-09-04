<template>
  <div class="tranfer-table-wrap">
    <el-table
      ref="multipleTableRef"
      header-align="center"
      empty-text="暂无选择数据"
      row-key="id"
      :header-cell-style="EltableHeaderStyle"
      :height="360"
      :data="state.tableData"
    >
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
      <el-table-column align="center">
        <template #header>
          <el-button type="primary" size="small" @click="clearAll">清空</el-button>
        </template>
        <template #default="scope">
          <i class="iconfont icon-shanchu5" @click="revertSelected(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="state.total > state.pageConfig.pageSize" class="pagination-box">
      <el-pagination
        :current-page="state.pageConfig.pageIndex"
        :page-size="state.pageConfig.pageSize"
        :total="state.total"
        background
        small
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { transOrgHeaders } from '../../config'
const emits = defineEmits(['revertSelectedRow', 'clearAllRows'])
const state = reactive({
  tableData: [] as any, // 分页展示的数据
  tableDataAll: [] as any, // 全部数据 提交时要用
  pageConfig: {
    pageIndex: 1,
    pageSize: 8
  },
  total: 0
})

// 表头样式
const EltableHeaderStyle = {
  backgroundColor: '#EDF3FF',
  color: '#333333',
  fontSize: '14px',
  fontWeight: 500
}

/**
 * 清空
 */
const clearAll = () => {
  emits('clearAllRows', state.tableDataAll)
}

/**
 * 删除
 */
const revertSelected = (row: any) => {
  emits('revertSelectedRow', row)
}

/**
 * 页码改变触发
 */
const handlePageChange = (val: number) => {
  state.pageConfig.pageIndex = val
  getData()
}

/**
 * 父组件调用：用于多选表格
 * tranferRef.value?.selectChange()
 */
const selectChange = (data: Array<any>) => {
  state.total = data.length
  state.tableDataAll = data
  getData()
}

/**
 * 分页渲染到页面
 */
const getData = () => {
  const { pageSize, pageIndex } = state.pageConfig
  const tempArr = [...state.tableDataAll]
  state.tableData = tempArr.splice(pageSize * (pageIndex - 1), pageSize)
}

defineExpose({ state, selectChange })
</script>

<style lang="scss" scoped>
.icon-shanchu5 {
  cursor: pointer;
  color: $mainColor;
  font-size: 20px;
}
.pagination-box {
  margin-top: 50px;
}
:deep(.el-button) {
  height: 22px;
  border: none;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #f2f2f2 !important;
}
</style>
