<template>
  <draw-component
    :drawer-visible="state.show"
    :show-bottom-btn="false"
    size="48%"
    :title="
      state.currStep === 1 && !state.currEditId
        ? '新增组织'
        : state.currStep === 1 && state.currEditId
        ? '组织详情'
        : state.currStep === 2 && !state.currEditId
        ? '新增组织-组织关系'
        : '组织详情-组织关系'
    "
    @close-drawer="handleClose()"
  >
    <div v-show="state.currStep === 1">
      <step-first
        ref="stepFstRef"
        :org-list="orgList"
        :formats-list="formatsList"
        :curr-edit-id="state.currEditId"
        :company-code="state.companyCode"
        @next-step="nextStep"
      ></step-first>
    </div>
    <div v-show="state.currStep === 2">
      <step-last
        ref="stepLastRef"
        :curr-select-type="state.currSelectType"
        :curr-edit-id="state.currEditId"
        :organization-code="state.organizationCode"
        :org-name="state.name"
        :company-code="state.companyCode"
        @submit="handleSubmit"
      ></step-last>
    </div>
    <template #footBtn>
      <div v-if="state.currStep == 1" class="handle-btn">
        <el-button class="btn cancel" @click="handleClose">取消</el-button>
        <el-button class="btn save" type="primary" @click="hanldeNext()">下一步</el-button>
      </div>
      <div v-else class="handle-btn">
        <el-button class="btn cancel" @click="state.currStep--">上一步</el-button>
        <el-button class="btn save" type="primary" @click="submit">保存</el-button>
      </div>
    </template>
  </draw-component>
</template>

<script setup lang="ts">
import StepFirst from './stepFirst.vue'
import StepLast from './stepLast.vue'
import { getOrgById, editOrgInfo, addOrgInfo } from '../api'
import { useProxy } from '@/utils/proxy'
import { PropType } from 'vue'
const props = defineProps({
  orgList: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  formatsList: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  }
})
const emit = defineEmits(['handleAdded'])
const { proxy } = useProxy()
const stepFstRef = ref()
const stepLastRef = ref()
const state = reactive({
  companyCode: '',
  isSubmiting: false,
  currStep: 1,
  name: '',
  currSelectType: '',
  currEditId: '',
  organizationCode: '',
  firstStepFormData: {} as any,
  show: false
})
// 关闭回调
const handleClose = () => {
  state.companyCode = ''
  state.currStep = 1
  state.currEditId = ''
  state.name = ''
  state.currSelectType = ''
  state.currEditId = ''
  state.organizationCode = ''
  state.firstStepFormData = {}
  stepLastRef.value.state.tableFstList = []
  stepLastRef.value.state.tableLastList = []
  stepFstRef.value.state.formData = {
    companyCode: '',
    organizationType: '',
    organizationCode: '',
    name: '',
    formats: '',
    status: true,
    managementForms: true,
    businessTime: [{ time: [] }] as any,
    contacts: '',
    phone: '',
    email: '',
    state: {},
    city: {},
    district: {},
    street: '',
    address: '',
    longitude: 116.307503,
    latitude: 39.984104,
    closeFlag: false,
    closeTime: ''
  }
  state.show = false
}
// 下一步
const hanldeNext = () => {
  stepFstRef.value.nextSubmit()
}
// 下一步回调
const nextStep = (e: any) => {
  state.currStep++
  state.currSelectType = e.currSelectType
  state.firstStepFormData = e.firstStepFormData
  state.organizationCode = e.organizationCode
  state.name = e.name
}
// 获取详情
const getDetail = () => {
  getOrgById(state.currEditId).then((res: any) => {
    const data = res.data
    stepFstRef.value.getOrgDetail(data)
    stepLastRef.value.getOrgDetail(data)
  })
}
// 保存
const submit = () => {
  stepLastRef.value.handleSubmit()
}
// 保存回调
const handleSubmit = (obj: any) => {
  state.isSubmiting = true
  const params = {
    ...state.firstStepFormData,
    state: state.firstStepFormData.state?.name || '',
    city: state.firstStepFormData.city?.name || '',
    district: state.firstStepFormData.district?.fullname || ''
  }
  if (state.currEditId) {
    editOrgInfo(state.currEditId, params)
      .then(() => {
        proxy.$message.msgSuccess('编辑成功')
        state.isSubmiting = false
        handleClose()
        emit('handleAdded')
      })
      .catch(() => {
        state.isSubmiting = false
      })
  } else {
    addOrgInfo({ ...params, ...obj })
      .then(() => {
        proxy.$message.msgSuccess('新增成功')
        state.isSubmiting = false
        handleClose()
        emit('handleAdded')
      })
      .catch(() => {
        state.isSubmiting = false
      })
  }
}
defineExpose({ state, getDetail })
</script>

<style lang="scss" scoped>
.handle-btn {
  text-align: center;
  margin-bottom: 20px;
  .btn {
    width: 96px;
    height: 32px;
    border-radius: 4px 4px 4px 4px;
    font-size: 14px;
  }

  .cancel {
    border: 1px solid $base-menu-color-active;
    margin-right: 18px;
    color: $base-menu-color-active;
  }
}
</style>
