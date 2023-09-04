<template>
  <draw-component
    :drawer-visible="state.show"
    :show-bottom-btn="false"
    size="55%"
    title="项值"
    @close-drawer="handleClose"
  >
    <div class="top-box df aic jcsb">
      <div class="top-title">数据列表</div>
      <el-popover popper-class="my-item-popover" :visible="addObj.show" placement="bottom-start" :width="330">
        <div class="item-title">新增项值</div>
        <el-form
          ref="formRef"
          :model="addObj.formData"
          label-position="right"
          size="default"
          :rules="addObj.rules"
        >
          <el-form-item label="项值标识:" prop="code">
            <el-input v-model="addObj.formData.code" type="text" placeholder="请输入标识" />
          </el-form-item>
          <el-form-item label="项值名称:" prop="name">
            <el-input v-model="addObj.formData.name" type="text" placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <div class="handle-btn">
          <el-button class="btn cancel" @click="handleItemClose">取消</el-button>
          <el-button class="btn save" type="primary" @click="handleSubmit">保存</el-button>
        </div>
        <template #reference>
          <el-button v-permission="{ action: 'add' }" type="primary" class="top-button-box" @click="addItem">
            <i class="iconfont icon-tianjia1"></i>新增
          </el-button>
        </template>
      </el-popover>
    </div>
    <table-page-content
      :loading="tableObj.loading"
      :table-data="tableObj.tableList"
      :table-headers="tableItemHeaders"
      table-height="68vh"
      :page-config="searchObj.pageConfig"
      @page-size-change="pageSizeChange"
      @current-page-change="currentPageChange"
    >
      <template #status="{ row }">
        <el-switch v-model="row.status" @click="changeStatus(row.ddCode, row.code, row.status)"></el-switch>
      </template>
    </table-page-content>
  </draw-component>
</template>

<script setup lang="ts">
import { tableItemHeaders } from '../config'
import { getDicsItemList, changeItemStatus, addItemSubmit } from '../api'
import { pageConfig } from '@/utils/config'
import { useProxy } from '@/utils/proxy'
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useProxy()
const formRef = ref<FormInstance>()
const state = reactive({
  show: false,
  id: ''
})
// 搜索对象
const searchObj = reactive({
  pageConfig: { ...pageConfig }
})
// 表格对象
const tableObj = reactive({
  loading: false,
  tableList: []
})
// 新增对象
const addObj = reactive({
  show: false,
  isSubmiting: false,
  formData: { code: '', name: '' },
  rules: {
    code: [{ required: true, message: '请输入标识', trigger: 'change' }],
    name: [{ required: true, message: '请输入名称', trigger: 'change' }]
  } as FormRules
})
// 关闭回调
const handleClose = () => {
  state.id = ''
  tableObj.tableList = []
  searchObj.pageConfig.pageNum = 1
  searchObj.pageConfig.total = 0
  state.show = false
}
// 修改状态
const changeStatus = (dicCode: string, itemCode: string, status: boolean) => {
  changeItemStatus(dicCode, itemCode, { status: status }).then((res) => {
    proxy.$message.msgSuccess('修改状态成功')
    getList()
  })
}
/**
 * 表格切换page-size
 * @param {number} val page-size回调值
 */
const pageSizeChange = (val: number) => {
  searchObj.pageConfig.pageSize = val
  searchObj.pageConfig.pageNum = 1
  getList()
}
/**
 * 获取列表数据
 * @param {number} val 页码回调值
 */
const currentPageChange = (val: number) => {
  searchObj.pageConfig.pageNum = val
  getList()
}
const getList = () => {
  tableObj.loading = true
  tableObj.tableList = []
  getDicsItemList<any>(state.id, {
    pageIndex: searchObj.pageConfig.pageNum,
    pageSize: searchObj.pageConfig.pageSize
  })
    .then((res) => {
      tableObj.tableList = res.data.data
      searchObj.pageConfig.total = res.data.total
      tableObj.loading = false
    })
    .catch(() => {
      tableObj.loading = false
    })
}
// 新增项
const addItem = () => {
  addObj.show = true
  formRef.value!.clearValidate()
}
// 关闭新增回调
const handleItemClose = () => {
  addObj.formData = { code: '', name: '' }
  formRef.value!.clearValidate()
  addObj.show = false
}
// 保存项
const handleSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      addObj.isSubmiting = true
      addItemSubmit(state.id, { ...addObj.formData })
        .then(() => {
          proxy.$message.msgSuccess('新增成功')
          addObj.isSubmiting = false
          handleItemClose()
          getList()
        })
        .catch(() => {
          addObj.isSubmiting = false
        })
    }
  })
}
defineExpose({ state, getList })
</script>

<style lang="scss" scoped>
.top-box {
  margin-bottom: 22px;
  .top-title {
    font-size: 20px;
    font-weight: bold;
    color: #333333;
  }
}
.my-item-popover {
  .handle-btn {
    text-align: center;
    margin-bottom: 15px;
    margin-top: 40px;
    .btn {
      width: 67px;
      height: 31px;
      border-radius: 4px 4px 4px 4px;
      font-size: 14px;
    }

    .cancel {
      border: 1px solid $base-menu-color-active;
      margin-right: 18px;
      color: $base-menu-color-active;
    }
  }
  .item-title {
    margin-bottom: 11px;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }
}
</style>
<style>
.my-item-popover {
  padding: 12px 34px !important;
}
</style>
