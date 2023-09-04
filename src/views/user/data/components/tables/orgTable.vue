<template>
  <div>
    <!-- <span>组织</span> -->
    <el-table
      ref="tableRef"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      :header-cell-style="EltableHeaderStyle"
      @selection-change="handleSelectionChange"
      @select="selectRow"
      @select-all="selectAll"
    >
      <el-table-column type="selection" label="状态"></el-table-column>
      <el-table-column
        v-for="item in orgHeaders"
        :key="item.label"
        :label="item.label"
        :prop="item.prop"
        align="center"
      >
        <template #default="{ row }">
          <section v-if="item.prop === 'organizationCode'">
            {{ spliceCodeName(row.organizationCode, row.organizationTypeDescr) }}
          </section>
          <section v-else-if="item.prop === 'organizationType'">
            {{ spliceCodeName(row.organizationType, row.durationTypeDescr) }}
          </section>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { spliceCodeName } from '@/utils'
import { orgHeaders } from '../../config'
import { ElTable } from 'element-plus'
const emits = defineEmits(['triggerTable', 'cancelRow', 'clear'])
const props = defineProps({
  limitedFields: {
    type: Array,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  }
})
let tableRef = ref<InstanceType<typeof ElTable>>()
// 表格选择
const handleSelectionChange = (rows: any) => {
  let limitFields: string[] = []
  rows.forEach((row: any) => {
    if (row) {
      limitFields.push(row.organizationCode)
    }
  })
  emits('triggerTable', limitFields)
}

const tableData = ref()

// 表头样式
const EltableHeaderStyle = {
  backgroundColor: '#EDF3FF',
  color: '#333333',
  fontSize: '14px',
  fontWeight: 600
}

watch(
  () => props.tableData,
  (newTable) => {
    tableData.value = newTable
    defaultCheck(newTable, props.limitedFields)
  }
)
watch(
  () => props.limitedFields,
  (newFields, oldFields) => {
    defaultCheck(props.tableData, newFields)
  }
)

// 默认选中
const defaultCheck = (table: any, limitedFields: any) => {
  nextTick(() => {
    if (table.length >= 1) {
      table.forEach((row: any) => {
        let str = row.organizationCode
        if (limitedFields.indexOf(str) > -1) {
          tableRef.value!.toggleRowSelection(row, true)
        }
      })
    }
  })
}
defaultCheck(props.tableData, props.limitedFields)

const selectRow = (rows: any, row: any) => {
  let selected = rows.length && rows.indexOf(row) !== -1
  if (!selected) {
    emits('cancelRow', row.organizationCode)
  }
}

const selectAll = (rows: any) => {
  if (rows.length <= 0) {
    emits('clear')
  }
}

const filterChange = (val: any) => {
  if (!tableData.value) return
  let searchTable = tableData.value.filter((row: any) => {
    if (val === row.organizationCode) {
      return row
    } else if (val === row.name) {
      return row
    } else if (val === row.storeCodeDescr) {
      return row
    }
  })
  return searchTable
}
</script>

<style lang="scss" scoped>
:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #f2f2f2 !important;
}
</style>
