<template>
  <div ref="appRef" class="container-box">
    <page-header />
    <scroll-tab v-model:scroll-val="state.systemCode" @tab-click="handleTabChange"></scroll-tab>
    <!-- 表格组件 -->
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableHeaders"
      :page-config="searchObj.pageConfig"
      :show-pager="tableObj.showPager"
      :table-height="tableHeight"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
    >
      <template #logo="{ row }">
        <div class="table-btn-box">
          <img :src="row.logo" class="menu-logo" />
        </div>
      </template>
      <template #dataPermissionLimit="{ row }">
        <div class="table-btn-box">
          <span v-if="row.dataPermissionLimit">区分</span>
        </div>
      </template>
      <template #operate="{ row }">
        <div class="table-btn-box">
          <el-button v-permission="{ action: 'edit' }" class="edit-btn" link @click="handleView(row)"
            ><i class="iconfont icon-chakanxiangqing"></i><span class="text">查看详情</span></el-button
          >
        </div>
      </template>
    </table-page-content>
    <edit-form
      ref="editRef"
      :edit-form="tableObj.editinfoForm"
      :dialog-visible="state.dialogVisible"
      :is-add="state.isAdd"
      :mktid-options="state.mktidOptions"
      @cancel-dialog="handleCancle"
      @save-dialog="saveDialog"
      @handle-cancle="handleCancle"
    />
  </div>
</template>

<script setup lang="ts" name="Menu">
import editForm from './components/edit.vue'
import { searchItem, tableHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { useTableHeight } from '@/hooks/tableHeight'
import { menuList, menuInfo, editMenuInfo } from './api'
import useScrollStore from '@/store/modules/scrollTab'
import { useProxy } from '@/utils/proxy'
const scrollStore = useScrollStore()
const { proxy } = useProxy()
const { appRef, tableHeight } = useTableHeight()
// 搜索对象
const searchObj = reactive({
  searchForm: { descr: null },
  pageConfig: { ...pageConfig },
  searchItem
})

const state = reactive({
  searchForm: {
    mktid: [], // 门店编码
    deptid: '', // 柜组
    flagDep: '', //所属位置
    flagCancel: '', // 是否有效
    updateTime: '', // 修改时间
    customSearch: '', // 自定义查询
    customOrder: null
  },

  searchItem, // 搜索项配置

  drawerVisible: false, // 是否显示组合查询

  tableHeaders, // 表头
  loading: false, // 是否记载
  tableData: [], // 表格数据
  pageConfig: {
    // 分页配置
    pageNum: 1,
    pageSize: 20,
    total: 0
  },

  dialogVisible: false, // 是否显示编辑框
  isAdd: false, // 编辑框是否新增

  mktidOptions: [], // 门店下拉选择
  menuId: '',
  systemCode: '' // 应用系统编码
})
const editRef = ref()
// 表格对象
const tableObj = reactive({
  loading: false,
  showPager: false,
  tableList: [],
  editinfoForm: {}
})

const init = () => {
  if (!scrollStore.getSystem) {
    scrollStore.getSystemList().then((res: any) => {
      if (res.length > 0) {
        state.systemCode = res[0].code
      }
      getMenuList()
    })
  } else {
    state.systemCode = scrollStore.systemList[0]?.code || ''
    getMenuList()
  }
}
const getMenuList = () => {
  let info = {
    checkButton: true,
    systemCode: state.systemCode
  }
  menuList(info).then((res: any) => {
    console.log(res)
    tableObj.tableList = res.data
  })
}
const handleSearch = (res: string) => {
  console.log(res)
}
const handleReset = () => {
  handleSearch('')
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
function pageSizeChange(val: number) {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
function currentPageChange(val: number) {
  searchObj.pageConfig.pageNum = val
}

// 查看详情
const handleView = (row: any) => {
  console.log(row)
  state.menuId = row.id
  menuInfo(row.id).then((res: any) => {
    console.log(res)
    tableObj.editinfoForm = res.data
    console.log('详情', tableObj.editinfoForm)
    state.isAdd = false
    state.dialogVisible = true
  })
}

// 取消
const handleCancle = () => {
  state.dialogVisible = false
}

// 保存
const saveDialog = (editForm: any) => {
  console.log(editForm)
  let info = {
    displayOrder: editForm.displayOrder,
    logo: editForm.logo,
    description: editForm.description
  }
  editMenuInfo(state.menuId, info).then((res: any) => {
    console.log(res)
    if (res.code == '200000') {
      proxy.$message.msgSuccess('修改成功')
      state.dialogVisible = false
      getMenuList()
    }
  })
}

// 应用菜单切换回调
const handleTabChange = () => {
  getMenuList()
}
init()
</script>

<style lang="scss" scoped>
.menu-logo {
  width: 14px;
  height: 14px;
}
</style>
