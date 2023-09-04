<template>
  <div>
    <el-table
      ref="tableRef"
      :data="tableData"
      row-key="precinctCode"
      style="width: 100%; margin-bottom: 20px"
      :header-cell-style="EltableHeaderStyle"
      :tree-props="{ children: 'precinct' }"
      default-expand-all
      @selection-change="handleSelectionChange"
      @select="toggleSelection"
      @select-all="selectAll"
    >
      <el-table-column
        :resizable="true"
        type="selection"
        label="状态"
        align="left"
        width="300"
      ></el-table-column>
      <el-table-column align="left" label="区域" prop="name">
        <template #default="{ row }">
          {{ spliceCodeName(row.precinctCode, row.name) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { spliceCodeName } from '@/utils'
const emits = defineEmits(['triggerTable', 'cancelRow', 'clear'])
const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  limitedFields: {
    type: Array,
    required: true
  }
})
let tableRef = ref()
const tableData = ref()
watch(
  () => props.tableData,
  (newTable) => {
    tableData.value = newTable
    nextTick(() => {
      defaultCheck(props.tableData, props.limitedFields)
    })
  }
)

// 表头样式
const EltableHeaderStyle = {
  backgroundColor: '#EDF3FF',
  color: '#333333',
  fontSize: '14px',
  fontWeight: 600
}

// 默认选中
const defaultCheck = (rows: any, codes: any) => {
  rows.forEach((row: any) => {
    if (codes.indexOf(row.precinctCode) != '-1') {
      tableRef.value!.toggleRowSelection(row, true)
      defaultCheck(row.precinct, codes)
    } else {
      if (row.precinct && row.precinct.length) {
        defaultCheck(row.precinct, codes)
      } else {
        return
      }
    }
  })
}

// 当选择项发生变化时会触发该事件
const handleSelectionChange = (rows: any) => {
  let selectRow = tableRef.value.getSelectionRows()
  let limitFields: string[] = []
  selectRow.forEach((item: any) => {
    limitFields.push(item.precinctCode)
  })
  emits('triggerTable', limitFields)
}

let precinctCode: Array<string> = []
// 多选框改变
const toggleSelection = (rows: any, row: any) => {
  let selectRow = tableRef.value.getSelectionRows()
  console.log(selectRow)
  let isFind = selectRow.find((item: any) => {
    return item.precinctCode === row.precinctCode
  })
  if (row.precinct && row.precinct.length > 0) {
    selectPart(row.precinct, isFind)
  }

  let selected = rows.length && rows.indexOf(row) !== -1
  if (!selected) {
    precinctCode = []
    getPrecinctCode(row)
    emits('cancelRow', precinctCode)
  }
  return
}

const getPrecinctCode = (row: any) => {
  precinctCode.push(row.precinctCode)
  if (row.precinct && row.precinct.length) {
    row.precinct.forEach((children: any) => {
      getPrecinctCode(children)
    })
  }
  // console.log(precinctCode)
}

// 判断选中状态
let flag = ref(true)
if (props.limitedFields.length === 0) flag.value = false

// 局部选择
const selectPart = (rows: any, isFind: any) => {
  if (isFind) {
    rows.forEach((row: any) => {
      if (!row.precinct) {
        tableRef.value!.toggleRowSelection(row, true)
      } else {
        selectPart(row.precinct, isFind)
        tableRef.value!.toggleRowSelection(row, true)
      }
    })
    flag.value = true
  } else {
    rows.forEach((row: any) => {
      if (!row.precinct) {
        tableRef.value!.toggleRowSelection(row, false)
      } else {
        tableRef.value!.toggleRowSelection(row, false)
        selectPart(row.precinct, isFind)
      }
    })
    flag.value = false
  }
}

// 全选
const selectAll = (table: any) => {
  if (!flag.value) {
    table.forEach((row: any) => {
      selectDenigrate(row)
    })
    flag.value = true
  } else {
    table.forEach((row: any) => {
      cancelDenigrate(row)
    })
    emits('clear')
    flag.value = false
  }
}

const selectDenigrate = (row: any) => {
  if (row.precinct && row.precinct.length > 0) {
    row.precinct.forEach((children: any) => {
      selectDenigrate(children)
    })
    tableRef.value!.toggleRowSelection(row, true)
  } else {
    tableRef.value!.toggleRowSelection(row, true)
  }
}

const cancelDenigrate = (row: any) => {
  if (row.precinct && row.precinct.length > 0) {
    row.precinct.forEach((children: any) => {
      cancelDenigrate(children)
    })
  } else {
    tableRef.value!.clearSelection()
  }
}

// 筛选
const filterChange = (val: any) => {
  if (!tableData.value) return
  let searchTable = tableData.value.filter((row: any) => {
    if (val === row.precinctCode) {
      return row
    } else if (val === row.name.trim()) {
      return row
    }
  })
  // defaultCheck(searchTable, props.limitedFields)
  return searchTable
}
</script>

<style lang="scss" scoped>
:deep(.el-table_27_column_91) {
  margin-right: 30px !important;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #f2f2f2 !important;
}
</style>
