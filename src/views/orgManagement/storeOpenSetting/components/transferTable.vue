<template>
  <div class="transfer-wrap">
    <!--搜索框-->
    <div class="search-wrap">
      <div class="red-text">勾选门店或快速定位门店：</div>
      <div>
        <el-input
          v-model.trim="searchObj.searchInfo"
          style="width: 200px"
          clearable
          placeholder="请输入组织编码或名称"
          @blur="getTableList"
          @clear="getTableList"
          @keyup.enter="handleOnKeyUp($event)"
        />
      </div>
    </div>
    <!--表格-->
    <div class="transfer-table-wrap">
      <div style="width: 50%">
        <table-page-content
          ref="sourceTableRef"
          :is-selection="true"
          :is-slot-num="false"
          :show-pager="false"
          :loading="tableObj.loading"
          :table-data="tableObj.tableList"
          :table-headers="tableObj.transferTableHeader"
          :table-height="tableHeight"
          :page-config="searchObj.pageConfig"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
          @handle-selection-change="handleSelectionChange"
        >
          <template #organizationType="{ row }">
            <span>{{ spliceCodeName(row.organizationType, row.organizationTypeDescr) }}</span>
          </template>
        </table-page-content>
        <el-pagination
          class="pager-wrap"
          :current-page="searchObj.pageConfig.pageNum"
          :page-size="searchObj.pageConfig.pageSize"
          :total="Number(searchObj.pageConfig.total)"
          background
          small
          :page-sizes="[20, 50, 100, 200]"
          :layout="'total,prev, pager, next'"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
        />
      </div>
      <table-page-content
        style="margin-left: 20px; width: 50%"
        :show-pager="false"
        :is-slot-num="false"
        :is-cus-header="true"
        :table-data="tableObj.transferList"
        :table-headers="tableObj.transferTableHeader"
        :table-height="tableHeight"
      >
        <template #organizationType="{ row }">
          <span>{{ spliceCodeName(row.organizationType, row.organizationTypeDescr) }}</span>
        </template>
        <template #cusHeader>
          <el-button plain type="primary" @click="removeAll">清空</el-button>
        </template>
        <template #customRow="{ row, $index }">
          <div class="table-btn-box">
            <i class="iconfont icon-shanchu5" @click="removeRow(row.id, $index)"></i>
          </div>
        </template>
      </table-page-content>
    </div>
  </div>
</template>

<script lang="ts" setup name="TransferTable">
// 搜索对象
import { transferTableHeader } from '../config'
import { pageConfig } from '@/utils/config'
import { spliceCodeName } from '@/utils'
import { getOrgsStore } from '../api'
import { useProxy } from '@/utils/proxy'
import { ElTable } from 'element-plus'

const { proxy } = useProxy()
const props = defineProps({
  companyCode: {
    type: String,
    default: ''
  },
  tableHeight: {
    type: Number,
    default: 250
  }
})
const emits = defineEmits(['emitsOrgCodes'])
const sourceTableRef = ref<InstanceType<typeof ElTable>>()
const searchObj = reactive({
  searchInfo: null,
  pageConfig: { ...pageConfig }
})
// 表格对象
const tableObj = reactive({
  transferTableHeader,
  loading: false,
  tableList: [] as any,
  tableHeight: 300,
  transferList: [] as any
})
const handleSelectionChange = (val: any) => {
  tableObj.transferList = val
}
// 传递组织信息最终参数
const emitsOrgCodes = (): any => {
  if (!tableObj.transferList.length) {
    proxy.$message.msgWarning('请勾选组织编码！')
    return false
  }
  let orgCodesArr: string[] = []
  let arr = tableObj.transferList
  arr.forEach((item: any) => {
    orgCodesArr.push(item.organizationCode)
  })
  emits('emitsOrgCodes', orgCodesArr)
  return true
}

/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getTableList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getTableList()
}
const handleOnKeyUp = (e: any) => {
  if (e.keyCode === 13) {
    getTableList()
  }
}
// 删除所有的同时，反选左侧所有
const removeAll = () => {
  if (!tableObj.transferList.length) return
  tableObj.transferList = []
  sourceTableRef.value?.clearSelection()
}
const removeRow = (id: string, index: number) => {
  // 删除的同时反选左侧table
  tableObj.transferList.splice(index, 1)
  tableObj.tableList.forEach((item: any) => {
    if (item.id === id) {
      sourceTableRef.value?.toggleRowSelection(item, false)
    }
  })
}
const getTableList = () => {
  if (!props.companyCode) return proxy.$message.msgWarning('请先选择企业信息')
  tableObj.loading = true
  tableObj.transferList = []
  tableObj.tableList = []
  getOrgsStore<any>({
    companyCode: props.companyCode,
    organizationType: '03', // 组织类型固定为门店03
    searchInfo: searchObj.searchInfo, // 组织编码或名称
    pageIndex: searchObj.pageConfig.pageNum,
    pageSize: searchObj.pageConfig.pageSize
  })
    .then((res) => {
      tableObj.tableList = res.data
      searchObj.pageConfig.total = res.total
      tableObj.loading = false
    })
    .catch(() => {
      tableObj.loading = false
    })
}
defineExpose({
  emitsOrgCodes
})
watch(
  () => props.companyCode,
  (val: string) => {
    if (val) {
      getTableList()
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.search-wrap {
  display: flex;
  align-items: center;
  margin: 30px 0 30px 0;
  .red-text {
    font-size: 14px;
    font-weight: 400;
    color: #ff554e;
  }
}
.pager-wrap {
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: flex-end;
}
.transfer-table-wrap {
  display: flex;
}
.iconfont {
  cursor: pointer;
  color: $blue;
}
.el-button:hover,
.el-button:focus {
  background-color: transparent !important;
}
</style>
