<template>
  <div class="table-content">
    <!-- <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="date" label="Date" sortable />
      <el-table-column prop="name" label="Name" sortable />
      <el-table-column prop="address" label="Address" sortable />
    </el-table> -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :height="tableHeight"
      :header-cell-style="EltableHeaderStyle"
      default-expand-all
      :tree-props="treeProps ? treeProps : { children: 'permissions', hasChildren: 'hasChildren' }"
      @current-change="handleRowChange"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="isSlotNum"
        v-slot="{ $index }"
        label="序号"
        :fixed="appStore.device == 'mobile' ? false : true"
        type="index"
        align="center"
        width="70"
      >
        <span v-if="showPager">{{ $index + (pageConfig.pageNum - 1) * pageConfig.pageSize + 1 }}</span>
        <span v-else>{{ $index + 1 }}</span>
      </el-table-column>
      <el-table-column
        v-if="isSelection"
        :reserve-selection="true"
        :fixed="appStore.device == 'mobile' ? false : true"
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableHeaders"
        :key="index"
        :label="item.label"
        :custom="item.prop"
        :prop="item.prop"
        :align="item.align"
        :fixed="item.fixed"
        :min-width="item.width"
        :show-overflow-tooltip="item.showTooltip ?? true"
        :empty-text="'暂无数据'"
      >
        <template #default="scope">
          <template v-if="item.isSlot">
            <slot :name="item.slotName" v-bind="scope"></slot>
          </template>
          <template v-else-if="isEdit">
            <slot :name="item.prop" v-bind="scope"></slot>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="isCusHeader" width="100">
        <template #header>
          <slot name="cusHeader"></slot>
        </template>
        <template #default="scope">
          <slot name="customRow" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showPager" class="pagination-box">
      <el-pagination
        :current-page="pageConfig.pageNum"
        :page-size="pageConfig.pageSize"
        :total="Number(pageConfig.total)"
        background
        small
        :page-sizes="[20, 50, 100, 200]"
        :layout="
          appStore.device == 'mobile' ? 'total,prev, pager, next' : 'total, sizes, jumper, prev, pager, next'
        "
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts" name="tableContent">
import useAppStore from '@/store/modules/app'
import { PropType } from 'vue'
import { ElTable } from 'element-plus'
const appStore = useAppStore()
const tableRef = ref<InstanceType<typeof ElTable>>()

const props = defineProps({
  // 是否显示序号，默认为true
  showIndex: {
    type: Boolean,
    default: true
  },
  // loading
  loading: {
    type: Boolean,
    default: false
  },
  // 表格数据
  tableData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  // 表格头
  tableHeaders: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  // 页码配置 total是字符串
  pageConfig: {
    type: Object as PropType<{ pageNum: number; pageSize: number; total: number }>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  },
  // 动态计算的表格高度
  tableHeight: {
    type: [String, Number],
    default: 'auto'
  },
  // 是否展示页码
  showPager: {
    type: Boolean,
    default: true
  },
  // 是否显示序号
  isSlotNum: {
    type: Boolean,
    default: true
  },
  // 表格树参数
  treeProps: {
    type: Object as PropType<any>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  },
  // 是否显示复选框
  isSelection: {
    type: Boolean,
    default: false
  },
  // 是否自定义表头
  isCusHeader: {
    type: Boolean,
    default: false
  },
  //是否是可编辑表格
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'pageSizeChange',
  'currentPageChange',
  'handleRowChange',
  'sortSearch',
  'handleSelectionChange',
  'handleRowClick'
])

/**
 * 每页条数变化
 *  @param {Number} val 当前设置的每页条数
 */
const handleSizeChange = (val: number) => {
  emit('pageSizeChange', val)
}

/**
 * 当前页码变化
 *  @param {Number} val 当前页码
 */
const handleCurrentChange = (val: number) => {
  emit('currentPageChange', val)
}

/**
 * 选择单行数据触发事件
 *  @param {Oobject} val 当前选中行数据
 */
const handleRowChange = (val: unknown) => {
  emit('handleRowChange', val)
}
const handleSelectionChange = (val: any) => {
  emit('handleSelectionChange', val)
}
// 点击行回调
const handleRowClick = (val: unknown) => {
  emit('handleRowClick', val)
}
// 表头样式
const EltableHeaderStyle = {
  backgroundColor: '#EDF3FF',
  color: '#333333',
  fontSize: '14px',
  fontWeight: 500
}

// 双击排序
const changeSort = (e: { order: string; prop: any }) => {
  const customOrder = e.order === 'ascending' ? `asc_${e.prop}` : `desc_${e.prop}`
  emit('sortSearch', customOrder)
}
// 子组件中获取不到element组件自身的方法，再转化一遍（店铺营业设置多选框table有用到）
const toggleRowSelection = (row: any, bol: boolean) => {
  tableRef.value?.toggleRowSelection(row, bol)
}
const clearSelection = () => {
  tableRef.value?.clearSelection()
}
defineExpose({
  toggleRowSelection,
  clearSelection
})
</script>
<style lang="scss" scoped>
.pager-container {
  background: #fff;
  height: 56px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
}

.pager-container.hidden {
  display: none;
}

:deep(.el-pagination.is-background) {
  .btn-prev,
  .btn-next {
    border-radius: 4px;
    background-color: $--color-primary;
    color: #fff;

    &:hover:not([disabled]) {
      color: #fff;
    }
  }

  .el-pager {
    .number {
      border-radius: 4px;
      color: #999;
      background-color: transparent;
    }

    li:not(.is-disabled).is-active {
      background-color: transparent;
      border: 1px solid #ccc;
      color: #333;
    }
  }
}
:deep(.el-table tr) {
  height: 44px;
}
.pagination-box {
  margin-top: 12px;

  .el-pagination {
    justify-content: flex-end;
  }
}
// 避免滚动条遮挡表体最后一行，但是会造成空表(表格无数据时)也会出现滚动条
:deep(.el-table__body) {
  margin-bottom: 10px;
}
:deep(.el-table--border .el-table__inner-wrapper tr:first-child td:first-child) {
  border-left: none;
}
:deep(.el-table__header .el-table__cell) {
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
}
:deep(.el-table--border .el-table__inner-wrapper::after) {
  display: none;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #f2f2f2 !important;
  // color:$--color-primary;
}

:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: #f2f2f2 !important;

  .cell {
    color: $--color-primary;
  }
}
:deep(.el-button) {
  line-height: 20px !important;
  height: 20px !important;
}
:deep(.el-switch) {
  line-height: 20px !important;
  height: 20px !important;
}
:deep(.el-table--border .el-table__inner-wrapper tr:first-child td:first-child) {
  border-left: none;
}
</style>
