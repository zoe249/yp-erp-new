<template>
  <div ref="appRef" class="org-area-view">
    <div class="content-box mb18">
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
    </div>
    <!-- 表格组件 -->
    <div class="table-box df">
      <div class="content-box">
        <div class="page-header">
          <div class="left">
            <div class="icon"></div>
            <div class="page-name">区域列表</div>
          </div>
          <div class="right">
            <div v-permission="{ action: 'add' }" class="add-btn" @click="addArea()">
              <span class="iconfont icon-tianjia1"></span>新增区域
            </div>
          </div>
        </div>
        <table-page-content
          :loading="tableTreeObj.loading"
          :table-data="tableTreeObj.tableList"
          :table-headers="tableTreeHeaders"
          :show-pager="false"
          :is-slot-num="false"
          :table-height="tableHeight + 40"
          :tree-props="{ children: 'precinct' }"
        >
          <template #name="{ row }">
            <span class="text-line" @click="searchStore(row.precinctCode)">{{
              spliceCodeName(row.precinctCode, row.name)
            }}</span>
          </template>
          <template #operate="{ row }">
            <el-popover popper-class="my-btn-popover-orgarea" trigger="hover" placement="right" width="140px">
              <template #reference>
                <span class="table-btn-box" style="display: inline-block">
                  <el-button v-permission="{ action: 'edit' }" class="edit-btn" link
                    ><span class="text">更多操作</span></el-button
                  >
                </span>
              </template>
              <div class="table-btn-box more-btn-box ais">
                <el-button v-permission="{ action: 'add' }" link @click="addArea('', row.precinctCode)"
                  ><span class="text">新增下级区域</span></el-button
                >
                <el-button v-permission="{ action: 'edit' }" link @click="addArea(row.id)"
                  ><span class="text">编辑区域</span></el-button
                >
                <el-button v-permission="{ action: 'remove' }" link @click="delArea(row.id)"
                  ><span class="text">删除区域</span></el-button
                >
                <el-button v-permission="{ action: 'add' }" link @click="addStore(row.precinctCode)"
                  ><span class="text">新增区域下的门店</span></el-button
                >
              </div>
            </el-popover>
          </template>
        </table-page-content>
      </div>
      <div class="content-box">
        <div class="page-header">
          <div class="left">
            <div class="icon"></div>
            <div class="page-name">门店列表</div>
          </div>
          <div class="right"></div>
        </div>
        <table-page-content
          :loading="tableObj.loading"
          :table-data="tableObj.tableList"
          :table-headers="tableHeaders"
          :table-height="tableHeight"
          :page-config="searchObj.pageConfig"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
        >
          <template #status="{ row }">
            <el-checkbox v-model="row.status" disabled @change="changeStatus(row.id)"></el-checkbox>
          </template>
          <template #formats="{ row }"> {{ spliceCodeName(row.formats, row.formatsDescr) }} </template>
          <template #district="{ row }">
            <span>
              {{
                `${row.state || ''}${row.city || ''}${row.district || ''}${row.street || ''}${
                  row.address || ''
                }` || ''
              }}
            </span>
          </template>
          <template #operate="{ row }">
            <div class="table-btn-box">
              <el-button
                v-permission="{ action: 'edit' }"
                class="delete-btn"
                link
                @click="editStore(row.id, row.organizationCode, row.name)"
                ><span class="text">修改所属区域</span></el-button
              >
            </div>
          </template>
        </table-page-content>
      </div>
    </div>
    <add-area-component
      ref="addAreaRef"
      :area-tree-data="tableTreeObj.souceTableList"
      @handle-added="getAreaList()"
    ></add-area-component>
    <add-store-component
      ref="addStoreRef"
      :area-tree-data="tableTreeObj.souceTableList"
    ></add-store-component>
    <edit-store-component
      ref="editStoreRef"
      :area-tree-data="tableTreeObj.souceTableList"
      @handle-added="getStoreList()"
    ></edit-store-component>
  </div>
</template>

<script setup lang="ts" name="orgArea">
import { searchItem, tableHeaders, tableTreeHeaders } from './config'
import { pageConfig } from '@/utils/config'
import { spliceCodeName, filterTreeArray } from '@/utils/index'
import { useTableHeight } from '@/hooks/tableHeight'
import { getAreaTree, getOrgStore, updateStoreStatus, deleteArea } from './api'
import useScrollStore from '@/store/modules/scrollTab'
import { useProxy } from '@/utils/proxy'
import addAreaComponent from './components/addArea.vue'
import addStoreComponent from './components/addStore.vue'
import editStoreComponent from './components/editStore.vue'
const { appRef, getTableHeight, tableHeight } = useTableHeight(true)
const { proxy } = useProxy()
const scrollStore = useScrollStore()
const addAreaRef = ref()
const addStoreRef = ref()
const editStoreRef = ref()
// 搜索对象
const searchObj = reactive({
  companyCode: '',
  precinctCode: '',
  searchForm: { precinctCode: null, name: null },
  pageConfig: { ...pageConfig },
  searchItem
})
// 表格树对象
const tableTreeObj = reactive({
  loading: false,
  tableList: [],
  souceTableList: []
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: []
})
// 搜索
const handleSearch = () => {
  getAreaList(true)
}
const handleReset = () => {
  searchObj.searchForm = { precinctCode: null, name: null }
  searchObj.precinctCode = ''
  tableObj.tableList = []
  searchObj.pageConfig.pageNum = 1
  searchObj.pageConfig.total = 0
  getAreaList()
}
// 切换企业
const handleTabChange = () => {
  searchObj.precinctCode = ''
  tableObj.tableList = []
  searchObj.pageConfig.pageNum = 1
  searchObj.pageConfig.total = 0
  getAreaList()
}
// 获取区域树数据
const getAreaList = (isSearch = false) => {
  tableTreeObj.loading = true
  tableTreeObj.tableList = []
  getAreaTree<any>({ companyCode: searchObj.companyCode })
    .then((res) => {
      if (isSearch) {
        tableTreeObj.tableList = filterTreeArray(res.data, searchObj.searchForm, 'precinct')
      } else {
        tableTreeObj.tableList = res.data
      }
      tableTreeObj.souceTableList = res.data
      tableTreeObj.loading = false
    })
    .catch(() => {
      tableTreeObj.loading = false
    })
}
// 获取门店列表数据
const getStoreList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getOrgStore<any>({
    precinctCode: searchObj.precinctCode,
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
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getStoreList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getStoreList()
}
// 新增/编辑区域
const addArea = async (id?: string, parentCode?: string) => {
  if (id) {
    // 编辑
    addAreaRef.value.state.editId = id
    await addAreaRef.value.getAreaDetail()
  } else if (parentCode) {
    // 新增下级
    addAreaRef.value.state.sourceParentCode = parentCode
    addAreaRef.value.state.formData.parentPrecinctCode = parentCode
  }
  addAreaRef.value.state.formData.companyCode = searchObj.companyCode
  addAreaRef.value.state.show = true
}
// 删除区域
const delArea = (id: string) => {
  proxy.$message.confirm('确认删除该区域?').then(async () => {
    await deleteArea(id)
    proxy.$message.msgSuccess('删除成功')
    getAreaList()
  })
}
// 新增区域下的门店
const addStore = (code: string) => {
  addStoreRef.value.state.formData.parentOrganizationCode = code
  addStoreRef.value.state.companyCode = searchObj.companyCode
  addStoreRef.value.getStoreList()
  addStoreRef.value.state.show = true
}
// 修改门店所属区域
const editStore = (id: string, code: string, name: string) => {
  editStoreRef.value.state.organizationCode = code
  editStoreRef.value.state.companyCode = searchObj.companyCode
  editStoreRef.value.state.formData.oldParentOrganizationCode = searchObj.precinctCode
  editStoreRef.value.state.formData.orgName = spliceCodeName(code, name)
  editStoreRef.value.state.show = true
}
// 点击应用获取角色
const searchStore = (code: string) => {
  searchObj.precinctCode = code
  getStoreList()
}
// 修改状态
const changeStatus = (id: string) => {
  updateStoreStatus(id).then(() => {
    proxy.$message.msgSuccess('修改门店状态成功')
  })
}
// 初始化函数
const init = () => {
  if (!scrollStore.getCompany) {
    scrollStore.getCompanyList().then((res: any) => {
      if (res.length > 0) {
        searchObj.companyCode = res[0].companyCode
        getAreaList()
      }
    })
  } else {
    searchObj.companyCode = scrollStore.companyList[0]?.companyCode || ''
    getAreaList()
  }
}
init()
</script>

<style lang="scss" scoped>
.org-area-view {
  height: 100%;
  .page-header {
    margin-bottom: 18px;
    height: 36px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page-name {
      font-size: 24px;
      font-weight: 500;
      color: #333333;
    }
    .icon {
      background: $--color-primary;
      width: 4px;
      height: 26px;
      margin-right: 12px;
      border-radius: 2px 2px 2px 2px;
    }
    .left {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .add-btn {
      cursor: pointer;
      width: 112px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #558df7;
      font-size: 16px;
      color: #558df7;
      .iconfont {
        margin-right: 6px;
      }
    }
  }

  .content-box {
    background: #fff;
    border-radius: 9px 9px 9px 9px;
    padding: 18px;
    opacity: 1;
  }
  .table-box {
    width: 100%;
    .content-box:first-child {
      margin-right: 18px;
      width: calc(38% - 88px);
    }
    .content-box:last-child {
      width: 62%;
    }
  }
  .more-btn-box {
    align-items: start !important;
  }
}
</style>
<style lang="scss">
.my-btn-popover-orgarea {
  min-width: 130px !important;
}
</style>
