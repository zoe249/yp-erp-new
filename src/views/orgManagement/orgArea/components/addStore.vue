<template>
  <dialog-component
    :dialog-visible="state.show"
    :size="380"
    title="新增区域下门店"
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
      <el-form-item label="管理区域:" prop="parentOrganizationCode">
        <el-tree-select
          v-model="state.formData.parentOrganizationCode"
          disabled
          :data="areaTreeData"
          node-key="precinctCode"
          check-strictly
          clearable
          :props="{ value: 'precinctCode', label: getTreeLableFunc, children: 'precinct' }"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="门店：" prop="organizationCodeList">
        <el-select
          v-model="state.formData.organizationCodeList"
          placeholder="请选择门店"
          value-key="organizationRelationTypeCode"
          multiple
          filterable
          allow-create
          collapse-tags
        >
          <el-option
            v-for="item in state.allOrgOptions"
            :key="item.organizationCode"
            :label="`${item.organizationCode}-${item.name}`"
            :value="item.organizationCode"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { addOrgStores } from '../api'
import { useProxy } from '@/utils/proxy'
import { formatDate } from '@/utils/index'
const props = defineProps({
  areaTreeData: {
    type: Array,
    default: () => []
  }
})
const { proxy } = useProxy()
const formRef = ref<FormInstance>()
const state = reactive({
  show: false,
  companyCode: '',
  isSubmiting: false,
  formData: { parentOrganizationCode: '', organizationCodeList: [] },
  formRules: {
    organizationCodeList: [{ required: true, message: '请选择门店', trigger: 'change' }]
  } as FormRules,
  allOrgOptions: [] as any
})
// 关闭回调
const handleClose = () => {
  state.companyCode = ''
  state.formData = { parentOrganizationCode: '', organizationCodeList: [] }
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
      const nowDate = new Date()
      const beginTime = formatDate(nowDate, true)
      const endTime = formatDate(new Date(nowDate.setFullYear(nowDate.getFullYear() + 50)), true)
      addOrgStores({
        ...state.formData,
        companyCode: state.companyCode,
        organizationRelationTypeCode: '01',
        status: true,
        beginTime,
        endTime
      })
        .then(() => {
          proxy.$message.msgSuccess('新增成功')
          state.isSubmiting = false
          handleClose()
        })
        .catch(() => {
          state.isSubmiting = false
        })
    }
  })
}
const getStoreList = () => [
  proxy.$api
    .getAllOrgInfo<any>({ organizationType: '03', status: true, companyCode: state.companyCode })
    .then((res) => {
      state.allOrgOptions = res.data || []
    })
]
defineExpose({ state, getStoreList })
</script>

<style lang="scss" scoped></style>
