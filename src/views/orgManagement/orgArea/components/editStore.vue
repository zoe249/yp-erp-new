<template>
  <dialog-component
    :dialog-visible="state.show"
    :size="380"
    title="修改所属区域"
    @close-dialog="handleClose()"
    @save-dialog="handleSubmit()"
  >
    <el-form
      ref="formRef"
      class="my-form-box2"
      :model="state.formData"
      :rules="state.formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="门店:" prop="orgName">
        <el-input v-model="state.formData.orgName" disabled></el-input>
      </el-form-item>
      <el-form-item label="原管理区域:">
        <el-tree-select
          v-model="state.formData.oldParentOrganizationCode"
          disabled
          :data="areaTreeData"
          check-strictly
          node-key="precinctCode"
          :props="{
            value: 'precinctCode',
            label: getTreeLableFunc,
            children: 'precinct'
          }"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="新管理区域:" prop="newParentOrganizationCode">
        <el-tree-select
          v-model="state.formData.newParentOrganizationCode"
          placeholder="请选择新管理区域"
          :data="areaTreeData"
          check-strictly
          node-key="precinctCode"
          :default-expand-all="true"
          :props="{ value: 'precinctCode', label: getTreeLableFunc, children: 'precinct' }"
          :render-after-expand="false"
        />
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { editStore } from '../api'
import { useProxy } from '@/utils/proxy'
import { formatDate } from '@/utils/index'
const props = defineProps({
  areaTreeData: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['handleAdded'])
const { proxy } = useProxy()
const formRef = ref<FormInstance>()
const state = reactive({
  show: false,
  companyCode: '',
  isSubmiting: false,
  organizationCode: '',
  formData: { orgName: '', oldParentOrganizationCode: '', newParentOrganizationCode: '' },
  formRules: {
    newParentOrganizationCode: [{ required: true, message: '请选择新的管理区域', trigger: 'change' }]
  } as FormRules
})
// 关闭回调
const handleClose = () => {
  state.organizationCode = ''
  state.companyCode = ''
  state.formData = { orgName: '', oldParentOrganizationCode: '', newParentOrganizationCode: '' }
  state.show = false
}
// 设置tree选项显示
const getTreeLableFunc = (item: any) => {
  return `${item.precinctCode}-${item.name}`
}
// 保存
const handleSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      state.isSubmiting = true
      // const nowDate = new Date()
      // const beginTime = formatDate(nowDate, true)
      // const endTime = formatDate(new Date(nowDate.setFullYear(nowDate.getFullYear() + 50)), true)
      editStore(state.organizationCode, {
        oldParentOrganizationCode: state.formData.oldParentOrganizationCode,
        newParentOrganizationCode: state.formData.newParentOrganizationCode,
        companyCode: state.companyCode
      })
        .then(() => {
          proxy.$message.msgSuccess('修改管理区域成功')
          state.isSubmiting = false
          handleClose()
          emit('handleAdded')
        })
        .catch(() => {
          state.isSubmiting = false
        })
    }
  })
}
defineExpose({ state })
</script>

<style lang="scss" scoped></style>
