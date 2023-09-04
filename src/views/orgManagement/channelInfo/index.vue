<template>
  <div ref="appRef" class="container-box">
    <page-header>
      <el-button v-permission="{ action: 'add' }" type="primary" class="top-button-box" @click="handleAdd()">
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
    <scroll-tab
      v-model:scroll-val="searchObj.companyCode"
      type="company"
      @tab-click="handleTabChange"
    ></scroll-tab>
    <!-- 表格组件 -->
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableHeaders"
      :table-height="tableHeight"
      :show-pager="false"
      :tree-props="{ children: 'channels' }"
    >
      <template #status="{ row }">
        <el-switch v-model="row.status" @click="changeStatus(row.id, row.status)"></el-switch>
      </template>
      <template #parentChannelsCode="{ row }">
        <span>{{
          row.parentChannelsCode == '0'
            ? ''
            : spliceCodeName(row.parentChannelsCode, row.parentChannelsCodeDescr)
        }}</span>
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'add' }" link @click="handleAdd(row.channelsCode)"
            ><i class="iconfont icon-tianjia1"></i><span class="text">新增下级</span></el-button
          >
          <el-button v-permission="{ action: 'edit' }" link @click="handleAdd(row.parentChannelsCode, row.id)"
            ><i class="iconfont icon-bianji4"></i><span class="text">编辑</span></el-button
          >
          <el-button v-permission="{ action: 'remove' }" link @click="handleDel(row.id)"
            ><i class="iconfont icon-tubiaozhizuomoban"></i><span class="text">删除</span></el-button
          >
        </div>
      </template>
    </table-page-content>
    <add-component
      ref="addRef"
      :channel-data="tableObj.souceTableList"
      @handle-added="getList"
    ></add-component>
  </div>
</template>

<script setup lang="ts" name="channelInfo">
import { searchItem, tableHeaders } from './config'
import { useTableHeight } from '@/hooks/tableHeight'
import { getChannelsTree, modifyChannelStatus, deleteChannel } from './api'
import { spliceCodeName, filterTreeArray } from '@/utils/index'
import addComponent from './components/index.vue'
import useScrollStore from '@/store/modules/scrollTab'
import { useProxy } from '@/utils/proxy'
const { appRef, getTableHeight, tableHeight } = useTableHeight(false, true)
const { proxy } = useProxy()
const scrollStore = useScrollStore()
const addRef = ref()
// 搜索对象
const searchObj = reactive({
  companyCode: '',
  searchForm: { channelsCode: null, name: null },
  searchItem
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: [],
  souceTableList: []
})
// 搜索
const handleSearch = () => {
  getList(true)
}
const handleReset = () => {
  searchObj.searchForm = { channelsCode: null, name: null }
  getList()
}
// 切换企业
const handleTabChange = () => {
  getList()
}
// 获取列表数据
const getList = (isSearch = false) => {
  tableObj.loading = true
  tableObj.tableList = []
  getChannelsTree<any>({
    ...searchObj.searchForm,
    companyCode: searchObj.companyCode
  })
    .then((res) => {
      if (isSearch) {
        tableObj.tableList = filterTreeArray(res.data, searchObj.searchForm, 'channels')
      } else {
        tableObj.tableList = res.data
      }
      tableObj.souceTableList = res.data
      tableObj.loading = false
    })
    .catch(() => {
      tableObj.loading = false
    })
}
// 修改状态
const changeStatus = (id: string, status: boolean) => {
  modifyChannelStatus(id, {
    status
  })
    .then(() => {
      proxy.$message.msgSuccess('修改状态成功')
    })
    .catch(() => {
      getList()
    })
}
// 删除
const handleDel = (id: string) => {
  proxy.$message.confirm('确认删除该渠道信息?').then(async () => {
    await deleteChannel(id)
    proxy.$message.msgSuccess('删除成功')
    getList()
  })
}
// 查看项值详情
const handleAdd = async (parentId?: string, id?: string) => {
  if (id && parentId) {
    // 编辑
    addRef.value.state.editId = id
    addRef.value.state.sourceParentCode = parentId
    await addRef.value.getRelationTypeDetail()
  } else if (parentId && !id) {
    // 新增下级
    addRef.value.state.sourceParentCode = parentId
    addRef.value.state.formData.parentChannelsCode = parentId
  }
  addRef.value.state.formData.companyCode = searchObj.companyCode
  addRef.value.state.show = true
}
// 初始化函数
const init = () => {
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then((res: any) => {
      if (res.length > 0) {
        searchObj.companyCode = res[0].companyCode
      }
      getList()
    })
  } else {
    searchObj.companyCode = scrollStore.companyList[0]?.companyCode || ''
    getList()
  }
}
init()
</script>

<style lang="scss" scoped></style>
