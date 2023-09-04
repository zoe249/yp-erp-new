<template>
  <div class="table-content">
    <el-table
      ref="tableRef"
      :data="tableData"
      :header-cell-style="EltableHeaderStyle"
      @selection-change="handleSelectionChange"
      @select="selectRow"
      @select-all="selectAll"
    >
      <el-table-column type="selection" label="状态"></el-table-column>
      <el-table-column
        v-for="item in storeHeaders"
        :key="item.label"
        :label="item.label"
        :prop="item.prop"
        align="center"
      >
        <template #default="{ row }">
          <section v-if="item.prop === 'organizationCode'">
            {{ spliceCodeName(row.organizationCode, row.organizationCodeDescr) }}
          </section>
          <section v-else-if="item.prop === 'type'">
            {{ spliceCodeName(row.type, row.typeDescr) }}
          </section>
          <section v-else-if="item.prop === 'storeCode'">
            {{ spliceCodeName(row.storeCode, row.storeCodeDescr) }}
          </section>
          <section v-else-if="item.prop === 'operatingStatus'">
            {{ spliceCodeName(row.operatingStatus, row.operatingStatusDescr) }}
          </section>
          <section v-else-if="item.prop === 'durationType'">
            {{ spliceCodeName(row.durationType, row.durationTypeDescr) }}
          </section>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { storeHeaders } from '../../config'
import { ElTable } from 'element-plus'
import { spliceCodeName } from '@/utils'
const emits = defineEmits(['triggerTable', 'cancelRow', 'clear'])
const props = defineProps({
  limitedFields: {
    type: Array,
    default: () => []
  },
  tableData: {
    type: Array,
    required: true
  }
})
let tableRef = ref<InstanceType<typeof ElTable>>()

// 表格选择
const handleSelectionChange = (rows: any) => {
  let limitFields: string[] = []
  rows.forEach((row: any) => {
    if (row) {
      limitFields.push(`${row.organizationCode}-${row.storeCode}`)
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
        let str = `${row.organizationCode}-${row.storeCode}`
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
    emits('cancelRow', `${row.organizationCode}-${row.storeCode}`)
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

const selectAll = (rows: any) => {
  if (rows.length <= 0) {
    emits('clear')
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #f2f2f2 !important;
}
</style>
