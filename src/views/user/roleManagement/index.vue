<template>
  <div ref="appRef" class="role-management-view">
    <div class="content-box mb18">
      <search-top-form
        class="search-form"
        :search-form="searchObj.searchForm"
        :search-item="searchObj.searchItem"
        @handle-search="handleSearch"
        @handle-reset="handleReset"
        @re-count-table-height="getTableHeight"
      ></search-top-form>
      <scroll-tab v-model:scroll-val="searchObj.systemCode" @tab-click="handleTabChange"></scroll-tab>
    </div>
    <!-- 表格组件 -->
    <div class="table-box df">
      <div class="content-box">
        <div class="page-header">
          <div class="left">
            <div class="icon"></div>
            <div class="page-name">角色列表</div>
          </div>
          <div class="right">
            <div v-permission="{ action: 'add' }" class="add-btn" @click="addRole()">
              <span class="iconfont icon-tianjia1"></span>新增角色
            </div>
          </div>
        </div>
        <table-page-content
          :loading="tableObj.loading"
          :table-data="tableObj.tableList"
          :table-headers="tableHeaders1"
          :table-height="tableHeight"
          :page-config="searchObj.pageConfig1"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
        >
          <template #name="{ row }">
            <span class="text-line" @click="searchUser(row.id)">{{ row.name }}</span>
          </template>
          <template #systemCode="{ row }">
            <span>{{ spliceCodeName(row.systemCode, row.systemCodeDescr) }}</span>
          </template>
          <template #type="{ row }">
            <span>{{ spliceCodeName(row.type, row.typeDescr) }}</span>
          </template>
          <template #operate="{ row }">
            <el-popover popper-class="my-btn-popover-role" trigger="hover" placement="left" width="70px">
              <template #reference>
                <div class="table-btn-box df jcc">
                  <el-button v-permission="{ action: 'edit' }" class="edit-btn" link
                    ><span class="text">更多操作</span></el-button
                  >
                </div>
              </template>
              <div class="table-btn-box more-btn-box">
                <el-button link @click="addRole(row.id)"
                  ><i class="iconfont icon-bianji4"></i><span class="text">编辑角色</span></el-button
                >
                <el-button link @click="delRole(row.id)"
                  ><i class="iconfont icon-tubiaozhizuomoban"></i
                  ><span class="text">删除角色</span></el-button
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
            <div class="page-name">用户列表</div>
          </div>
          <div class="right"></div>
        </div>
        <table-page-content
          :loading="tableObj2.loading"
          :table-data="tableObj2.tableList"
          :table-headers="tableHeaders2"
          :table-height="tableHeight"
          :page-config="searchObj.pageConfig2"
          @page-size-change="pageSizeChange2"
          @current-page-change="currentPageChange2"
        >
          <template #userType="{ row }">
            <span>{{ spliceCodeName(row.userType, row.userTypeDescr) }}</span>
          </template>
          <template #status="{ row }">
            <span>{{ spliceCodeName(row.status, row.statusDescr) }}</span>
          </template>
          <template #operate="{ row }">
            <div class="table-btn-box">
              <el-button v-permission="{ action: 'remove' }" class="delete-btn" link @click="delUser(row.id)"
                ><i class="iconfont icon-tubiaozhizuomoban"></i><span class="text">删除</span></el-button
              >
            </div>
          </template>
        </table-page-content>
      </div>
    </div>
    <add-role-component
      ref="addRoleRef"
      :role-type-options="tableObj.roleTypeOptions"
      @handle-added="getRoleList()"
    ></add-role-component>
  </div>
</template>
<script setup lang="ts" name="RoleManagement">
import { searchItem, tableHeaders1, tableHeaders2 } from './config'
import { pageConfig } from '@/utils/config'
import { formatDate, spliceCodeName } from '@/utils/index'
import { useTableHeight } from '@/hooks/tableHeight'
import addRoleComponent from './components/addRole.vue'
import { getRoleMList, getUserMList, delSubmit, delUserSubmit } from './api'
import { getDicsList } from '@/hooks/dicsData'
import { useProxy } from '@/utils/proxy'
import useScrollStore from '@/store/modules/scrollTab'
const { appRef, getTableHeight, tableHeight } = useTableHeight(true)
const addRoleRef = ref()
const scrollStore = useScrollStore()
const { proxy } = useProxy()
// 搜索对象
const searchObj = reactive({
  systemCode: '',
  roleId: '',
  searchForm: { roleName: null },
  pageConfig1: { ...pageConfig }, // 角色分页
  pageConfig2: { ...pageConfig }, // 用户分页
  searchItem
})
// 表格对象-角色
const tableObj = reactive({
  loading: false,
  roleTypeOptions: [] as TselectOptions[],
  tableList: []
})
// 表格对象-用户
const tableObj2 = reactive({
  loading: false,
  tableList: []
})
const handleSearch = () => {
  searchObj.pageConfig1.pageNum = 1
  getRoleList()
}
const handleReset = () => {
  searchObj.searchForm = { roleName: null }
  searchObj.roleId = ''
  tableObj2.tableList = []
  searchObj.pageConfig2.pageNum = 1
  searchObj.pageConfig2.total = 0
  handleSearch()
}
// 应用菜单切换回调
const handleTabChange = () => {
  searchObj.roleId = ''
  tableObj2.tableList = []
  searchObj.pageConfig2.pageNum = 1
  searchObj.pageConfig2.total = 0
  handleSearch()
}
// 获取角色列表
const getRoleList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getRoleMList<any>({
    ...searchObj.searchForm,
    pageIndex: searchObj.pageConfig1.pageNum,
    pageSize: searchObj.pageConfig1.pageSize,
    systemCode: searchObj.systemCode
  })
    .then((res) => {
      tableObj.tableList = res.data
      searchObj.pageConfig1.total = res.total
      tableObj.loading = false
    })
    .catch(() => {
      tableObj.loading = false
    })
}
// 获取用户列表
const getUserList = () => {
  tableObj2.loading = true
  tableObj2.tableList = []
  getUserMList<any>({
    roleId: searchObj.roleId,
    pageIndex: searchObj.pageConfig2.pageNum,
    pageSize: searchObj.pageConfig2.pageSize
  })
    .then((res) => {
      tableObj2.tableList = res.data
      searchObj.pageConfig2.total = res.total
      tableObj2.loading = false
    })
    .catch(() => {
      tableObj2.loading = false
    })
}
// 新增角色
const addRole = async (id?: string) => {
  if (id) {
    addRoleRef.value.state.currRoleId = id
    addRoleRef.value.getRoleDetail()
  } else {
    const nowDate = new Date()
    addRoleRef.value.state.formData.beginTime = formatDate(nowDate, true)
    addRoleRef.value.state.formData.endTime = formatDate(
      new Date(nowDate.setFullYear(nowDate.getFullYear() + 50)),
      true
    )
    addRoleRef.value.state.formData.systemCode = searchObj.systemCode
  }
  addRoleRef.value.state.show = true
}
// 删除角色
const delRole = (id: string) => {
  proxy.$message.confirm('确认删除该角色?').then(async () => {
    await delSubmit(id)
    proxy.$message.msgSuccess('删除成功')
    getRoleList()
  })
}
// 删除用户
const delUser = (id: string) => {
  proxy.$message.confirm('确认删除该角色下的此用户?').then(async () => {
    await delUserSubmit(id)
    proxy.$message.msgSuccess('删除成功')
    getUserList()
  })
}
// 点击应用获取角色
const searchUser = (id: string) => {
  searchObj.roleId = id
  getUserList()
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  searchObj.pageConfig1.pageSize = val
  searchObj.pageConfig1.pageNum = 1
  getRoleList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig1.pageNum = val
  getRoleList()
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange2 = (val: number) => {
  searchObj.pageConfig2.pageSize = val
  searchObj.pageConfig2.pageNum = 1
  getUserList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
function currentPageChange2(val: number) {
  searchObj.pageConfig2.pageNum = val
  getUserList()
}
const init = () => {
  if (!scrollStore.getSystem) {
    scrollStore.getSystemList().then((res: any) => {
      if (res.length > 0) {
        searchObj.systemCode = res[0].code
      }
      getRoleList()
    })
  } else {
    searchObj.systemCode = scrollStore.systemList[0]?.code || ''
    getRoleList()
  }
  getDicsList('H007').then((res: any) => {
    tableObj.roleTypeOptions = res
  })
}
init()
</script>

<style lang="scss" scoped>
.role-management-view {
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
      width: calc(58% - 88px);
    }
    .content-box:last-child {
      width: 42%;
    }
  }
}
</style>
<style lang="scss">
.my-btn-popover-role {
  min-width: 130px !important;
}
</style>
