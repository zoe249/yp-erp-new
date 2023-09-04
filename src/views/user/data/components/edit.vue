<template>
  <draw-component
    :drawer-visible="drawerVisible"
    size="900px"
    title="新增数据权限控制"
    @close-drawer="handleClose"
    @save-drawer="handleSubmit"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-width="90px"
      class="my-form-box"
    >
      <div class="flex-line">
        <div class="flex-line-left">
          <el-form-item label="账号：" prop="userCode">
            <el-input
              v-model="state.formData.userCode"
              :disabled="!!rowId"
              placeholder="请输入账号"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="应用：" prop="systemCode">
            <el-select
              v-model="state.formData.systemCode"
              placeholder="请选择应用"
              :disabled="!!rowId"
              @change="handleSystem(state.formData.systemCode)"
            >
              <el-option
                v-for="item in state.systemOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="功能：" prop="function">
            <el-select v-model="state.formData.function" placeholder="请选择功能">
              <el-option
                v-for="item in state.functionOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="筛选维度：" prop="dimension">
            <el-select
              v-model="state.formData.dimension"
              placeholder="请选择筛选维度"
              :disabled="!!rowId"
              @change="handleDimension(state.formData.dimension, true)"
            >
              <el-option
                v-for="item in state.dimensionOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="有效期：" prop="date" class="c-date-input-box">
            <div style="display: flex" class="form-date-box">
              <el-date-picker
                v-model="state.formData.beginTime"
                style="width: 100%"
                type="date"
                :clearable="false"
                :disabled-date="disabledBegin"
                :placeholder="datePlaceholder.beginTime"
                value-format="YYYY-MM-DD"
                @change="handleBeginTime"
              />
              &nbsp;-&nbsp;
              <el-date-picker
                v-model="state.formData.endTime"
                style="width: 100%"
                type="date"
                :clearable="false"
                :disabled-date="disabledEnd"
                :placeholder="datePlaceholder.endTime"
                value-format="YYYY-MM-DD"
                @change="handleEndTime"
              />
            </div>
          </el-form-item>
        </div>
        <el-form-item label="勾选菜单目录：" prop="permissionIds" class="flex-line-right">
          <el-tree
            ref="treeRef"
            :data="state.permissionMenu"
            :props="state.props"
            node-key="permissionKey"
            default-expand-all
            :check-strictly="false"
            show-checkbox
            @check="handleTree"
          />
        </el-form-item>
      </div>
    </el-form>

    <div class="content-table">
      <el-form-item :label="tableObj.tableLabel + '：'">
        <el-input
          v-model="tableObj.searchVal"
          placeholder="输入编码或名称"
          clearable
          @keyup.enter="handleSearch(tableObj.searchVal)"
        />
      </el-form-item>
      <precincts-table
        v-if="state.formData.dimension === '01'"
        ref="preRef"
        :table-data="tableObj.precinctsTable"
        :limited-fields="state.formData.limitedFields"
        @trigger-table="triggerTable"
        @cancel-row="cancelRow"
        @clear="clear"
      />

      <org-table
        v-if="state.formData.dimension === '02'"
        ref="orgRef"
        :table-data="tableObj.organizationsTable"
        :limited-fields="state.formData.limitedFields"
        @trigger-table="triggerTable"
        @cancel-row="cancelRow"
        @clear="clear"
      />

      <store-table
        v-if="state.formData.dimension === '03'"
        ref="storeRef"
        :table-data="tableObj.storeTable"
        :limited-fields="state.formData.limitedFields"
        @trigger-table="triggerTable"
        @cancel-row="cancelRow"
        @clear="clear"
      />

      <div class="content-pagination">
        <el-pagination
          v-if="
            (state.formData.dimension === '02' && tableObj.pageConfig.total > 8) ||
            (state.formData.dimension === '03' && tableObj.pageConfig.total > 8)
          "
          v-model:currentPage="tableObj.pageConfig.pageIndex"
          :page-size="tableObj.pageConfig.pageSize"
          small
          background
          layout="prev, pager, next"
          :total="tableObj.pageConfig.total"
          @current-change="currentChange"
        />
      </div>
    </div>
  </draw-component>
</template>

<script setup lang="ts">
import type { FormRules, ElTree, ElForm } from 'element-plus'
import { getDicsList } from '@/hooks/dicsData'
import { useDateDisable } from '@/hooks/dateDisable'
import { searchFilter } from '@/utils'
import { useProxy } from '@/utils/proxy'
import { useMenuTree } from '../hooks/menuTree'
import { orgTable, precinctsTable, storeTable } from './tables'
import {
  menuTree,
  systemList,
  getDetailById,
  addSubmit,
  queryPrecincts,
  queryOrg,
  queryStore,
  editDataById
} from '../api'

interface stateType {
  formData: {
    userCode: string
    systemCode: string
    function: string
    dimension: string
    beginTime: string | Date
    endTime: string | Date
    permissionKeys: Array<string>
    limitedFields: Array<string>
    [key: string]: any
  }
  props: { label: string; children: string }
  systemOptions: Array<any>
  functionOptions: Array<any>
  dimensionOptions: Array<any>
  permissionMenu: Array<any>
  [key: string]: any
}
const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: true
  },
  rowId: {
    type: String,
    default: ''
  },
  dateTime: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['submit', 'cancel'])

const { proxy } = useProxy()

const userCodeVildate = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('账号不允许为空!'))
  }
  const reg = /^[a-zA-Z0-9_-]{3,16}$/
  if (!reg.test(value)) {
    callback(new Error('请输入30个字符以内的合法字符!'))
  } else {
    proxy.$api.getCompanyByUser({ code: value }).then((res) => {
      if (!res.data) {
        callback(new Error('账号不存在!'))
        state.companyCode = ''
      } else {
        state.companyCode = res.data.companyCode
        callback()
      }
    })
  }
}
const state: stateType = reactive({
  formData: {
    userCode: '',
    systemCode: '',
    function: '',
    dimension: '',
    beginTime: '',
    endTime: '',
    permissionKeys: [],
    limitedFields: []
  },
  companyCode: '', // 企业信息
  systemOptions: [] as TselectOptions[],
  functionOptions: [] as TselectOptions[],
  dimensionOptions: [] as TselectOptions[],
  props: {
    label: 'name',
    children: 'permissions'
  },
  formRules: {
    userCode: [{ required: true, validator: userCodeVildate, trigger: 'blur' }],
    systemCode: [{ required: true, message: '选择应用系统', trigger: 'change' }],
    function: [{ required: true, message: '选择功能', trigger: 'change' }],
    dimension: [{ required: true, message: '选择筛选维度', trigger: 'change' }]
  } as FormRules,
  permissionMenu: []
})

const tableObj = reactive({
  tableLabel: '勾选对应的组织或快速定位到组织',
  searchVal: '',
  pageConfig: {
    pageSize: 8,
    pageIndex: 1,
    total: 0
  },
  precinctsTable: [],
  organizationsTable: [],
  storeTable: [],
  limitedFields: []
})

const treeRef = ref<InstanceType<typeof ElTree>>()
const formRef = ref<InstanceType<typeof ElForm>>()

// 时间组件 hooks
const { datePlaceholder, handleBeginTime, handleEndTime, disabledBegin, disabledEnd } = useDateDisable(
  state,
  props.dateTime
)

// 根据id查询用户详情
const getUserDetail = () => {
  if (!props.rowId) return
  getDetailById(props.rowId).then((res: any) => {
    Object.keys(state.formData).forEach((key: string) => {
      state.formData[key] = res.data[key]
    })
    state.formData.permissionKeys = [res.data.permissionKey]
    // 获取树节点
    getMenuTree(res.systemCode, res.data.permissionKey)
    // 根据筛选维度获取表
    handleDimension(state.formData.dimension, false)
  })
}

// 筛选维度,调用不同的接口，渲染不同维度的表格
const handleDimension = (val: string, clear: boolean) => {
  tableObj.searchVal = ''
  clear ? (state.formData.limitedFields = []) : ''
  const params = {
    pageSize: tableObj.pageConfig.pageSize,
    pageIndex: tableObj.pageConfig.pageIndex,
    companyCode: state.companyCode
  }
  switch (val) {
    case '01':
      tableObj.tableLabel = '勾选对应的区域或快速定位到区域'
      queryPrecincts({ companyCode: state.companyCode }).then((res: any) => {
        tableObj.precinctsTable = res.data
      })
      break
    case '02':
      tableObj.tableLabel = '勾选对应的组织或快速定位到组织'
      queryOrg(params).then((res: any) => {
        tableObj.organizationsTable = res.data
        tableObj.pageConfig.total = res.total
      })
      break
    case '03':
      tableObj.tableLabel = '勾选对应的店铺或快速定位到店铺'
      queryStore(params).then((res: any) => {
        tableObj.storeTable = res.data
        tableObj.pageConfig.total = res.total
      })
      break
    case '04':
      tableObj.tableLabel = '勾选对应的品类或快速定位到品类'
      // return
      break
  }
}

const { handleTree, handleSystem, getMenuTree } = useMenuTree(state, treeRef, menuTree, props.rowId)

// 修改页码
const currentChange = (val: number) => {
  tableObj.pageConfig.pageIndex = val
  handleDimension(state.formData.dimension, false)
}

// 修改组织
const triggerTable = (limitFields: any) => {
  let limitedFields = [...state.formData.limitedFields, ...limitFields]
  state.formData.limitedFields = limitedFields.filter((item, index) => {
    return limitedFields.indexOf(item) === index
  })
}

// 修改组织 取消
const cancelRow = (limitFields: any) => {
  if (state.formData.dimensionVal === '01') {
    let limitedFields = state.formData.limitedFields
    limitFields.forEach((field: any) => {
      state.formData.limitedFields.splice(limitedFields.indexOf(field), 1)
    })
  } else {
    let limitedFields = state.formData.limitedFields
    state.formData.limitedFields.splice(limitedFields.indexOf(limitFields), 1)
  }
}

// 取消全选
const clear = () => {
  let limitFields: Array<any> = []
  const dimension = state.formData.dimension
  switch (dimension) {
    case '01':
      state.formData.limitedFields = []
      break
    case '02':
      tableObj.organizationsTable.forEach((row: any) => {
        limitFields.push(row.organizationCode)
      })
      limitFields.forEach((field) => {
        let limitedFields = state.formData.limitedFields
        state.formData.limitedFields.splice(limitedFields.indexOf(field), 1)
      })
      break
    case '03':
      tableObj.storeTable.forEach((row: any) => {
        limitFields.push(`${row.organizationCode}-${row.storeCode}`)
      })
      limitFields.forEach((field) => {
        let limitedFields = state.formData.limitedFields
        state.formData.limitedFields.splice(limitedFields.indexOf(field), 1)
      })
      break
  }
}

// 根据参数筛选显示表格
const queryBySearch = (val: string) => {
  const params = {
    pageSize: tableObj.pageConfig.pageSize,
    pageIndex: tableObj.pageConfig.pageIndex,
    companyCode: state.companyCode
  }
  switch (state.formData.dimension) {
    case '01':
      tableObj.precinctsTable = searchFilter(tableObj.precinctsTable, 'name', val, 'precinct')
      break
    case '02':
      queryOrg({ ...params, searchInfo: val }).then((res: any) => {
        tableObj.organizationsTable = res.data
        tableObj.pageConfig.total = res.total
      })
      break
    case '03':
      queryStore({ ...params, store: val }).then((res: any) => {
        tableObj.storeTable = res.data
        tableObj.pageConfig.total = res.total
      })
      break
  }
}

// 输入搜索关键字的回调函数
const handleSearch = (val: string) => {
  tableObj.pageConfig.pageIndex = 1
  let searchVal = val.trim()
  if (!searchVal) {
    handleDimension(state.formData.dimension, false)
  } else {
    queryBySearch(searchVal)
  }
}

const handleClose = () => {
  emits('cancel')
}
const handleSubmit = () => {
  if (!state.formData.beginTime) state.formData.beginTime = datePlaceholder.value.beginTime
  if (!state.formData.endTime) state.formData.endTime = datePlaceholder.value.endTime
  formRef.value?.validate((valid: any, fields: any) => {
    if (valid) {
      if (!props.rowId) {
        addSubmit(state.formData).then((res) => {
          if (res.code === '200000') {
            proxy.$message.msgSuccess('新增成功')
            setTimeout(() => emits('submit'), 1500)
          }
        })
      } else {
        const params = {
          function: state.formData.function,
          beginTime: state.formData.beginTime,
          endTime: state.formData.endTime,
          limitedFields: state.formData.limitedFields
        }
        editDataById(props.rowId, params).then((res) => {
          if (res.code === '200000') {
            proxy.$message.msgSuccess('修改成功')
            setTimeout(() => emits('submit'), 1500)
          }
        })
      }
    }
  })
}

// 初始化方法
const init = async () => {
  // 选择应用系统
  const systemRes = await systemList()
  state.systemOptions = systemRes.data as TselectOptions[]
  // 功能权限字典
  state.functionOptions = await getDicsList('H009')
  // 获取筛选维度字典
  state.dimensionOptions = await getDicsList('H010')
  getUserDetail()
}
init()
</script>

<style lang="scss" scoped>
.flex-line {
  width: 100%;
  display: flex;
  align-items: flex-start;
  &-left {
    width: 55%;
    :deep(.el-form-item__content) {
      width: 280px;
    }
  }
  &-right {
    width: 45%;
    :deep(.el-tree) {
      width: 90%;
      // min-height: 350px;
      height: 280px;
      overflow: auto;
      padding: 10px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.16);
      .is-checked {
        .el-checkbox__inner {
          background: $mainColor !important;
          border: 1px solid $mainColor !important;
        }
      }
    }
  }
}
.content-table {
  // margin-top: 20px;
  :deep(.el-form-item__label) {
    color: #ff554e;
    font-size: 14px;
  }
  .el-input {
    width: 270px;
  }
  :deep(.el-table) {
    height: 350px;
    overflow: auto;
    th.el-table__cell > .cell {
      border-right: none;
    }
    th.el-table__cell:first-child > .cell {
      line-height: 26px;
    }
  }
  .content-pagination {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.form-date-box {
  :deep(.el-form-item__content) {
    width: 129px;
  }
  :deep(.el-input__wrapper) {
    padding-right: 9px;
  }
}
</style>
