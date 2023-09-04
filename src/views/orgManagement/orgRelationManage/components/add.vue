<template>
  <draw-component
    :drawer-visible="drawerVisible"
    title="新增组织关系"
    size="900px"
    @close-drawer="handleClose"
    @save-drawer="handleSubmit"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-position="right"
      label-width="auto"
      class="my-form-box"
    >
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item label="企业：" prop="companyCode">
            <el-select v-model="state.formData.companyCode" disabled>
              <el-option
                v-for="item in selectOptions.companyOptions"
                :key="item.companyCode"
                :label="`${item.companyCode} - ${item.companyName}`"
                :value="item.companyCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="state.colSpan">
          <el-form-item label="状态：" prop="status">
            <el-switch v-model="state.formData.status" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item label="组织关系类型：" prop="organizationRelationTypeCode">
            <el-select v-model="state.formData.organizationRelationTypeCode" placeholder="请选择组织关系类型">
              <el-option
                v-for="item in selectOptions.orgRelationTypeOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="state.colSpan">
          <el-form-item label="有效期 ：" prop="date">
            <div style="display: flex" class="form-date-box">
              <el-date-picker
                v-model="state.formData.beginTime"
                style="width: 49%"
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
                style="width: 49%"
                type="date"
                :clearable="false"
                :disabled-date="disabledEnd"
                :placeholder="datePlaceholder.endTime"
                value-format="YYYY-MM-DD"
                @change="handleEndTime"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="state.gutter">
        <el-col :span="14">
          <el-form-item label="父级组织：" prop="parentOrganizationCode">
            <el-cascader
              v-model="state.formData.parentOrganizationCode"
              :options="state.orgOptions"
              :props="state.props"
              placeholder="请选择父级组织"
              collapse-tags
              collapse-tags-tooltip
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <transfer-table
      ref="transferRef"
      :company-code="companyCode"
      :search-tip="'勾选对应的组织或快速定位组织：'"
    />
  </draw-component>
</template>

<script setup lang="ts">
import transferTable from './table/index.vue'
import { useDateDisable } from '@/hooks/dateDisable'
import { queryPrecincts, addSubmit } from '../api'
import type { FormInstance } from 'element-plus'
import { useProxy } from '@/utils/proxy'

const { proxy } = useProxy()
const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  dateTime: {
    type: Object,
    required: true
  },
  companyCode: {
    type: String,
    default: ''
  },
  selectOptions: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['cancel', 'submit'])

const transferRef = ref<InstanceType<typeof transferTable>>()

const state = reactive({
  formData: {
    companyCode: '',
    organizationRelationTypeCode: '',
    status: true,
    parentOrganizationCode: '',
    beginTime: '',
    endTime: ''
  },
  formRules: {
    companyCode: { required: true, message: '请选择企业编码', trigger: 'change' },
    organizationRelationTypeCode: { required: true, message: '请选择组织关系类型', trigger: 'change' },
    parentOrganizationCode: { required: true, message: '请选择父级组织', trigger: 'change' },
    status: { required: true, trigger: 'change' }
  },
  orgOptions: [],
  props: {
    label: 'name',
    children: 'precinct',
    // multiple: true,
    value: 'precinctCode'
  },
  colSpan: 12,
  gutter: 20
})

const formRef = ref<FormInstance>()

// 时间组件 hooks
const { datePlaceholder, handleBeginTime, handleEndTime, disabledBegin, disabledEnd } = useDateDisable(
  state,
  props.dateTime
)

const handleClose = () => {
  emits('cancel')
}
const handleSubmit = () => {
  // 批量获取组织编码
  const organizationCodeList = transferRef.value?.getSelectData()
  const params = { ...state.formData, organizationCodeList }
  params.parentOrganizationCode = params.parentOrganizationCode[0]
  // 获取时间有效期，没有则取默认值
  if (!params.beginTime) params.beginTime = datePlaceholder.value.beginTime
  if (!params.endTime) params.endTime = datePlaceholder.value.endTime

  formRef.value?.validate((valid: any, fields: any) => {
    if (valid) {
      addSubmit(params).then((res: any) => {
        if (res.code === '200000') {
          proxy.$message.msgSuccess('新增成功')
          setTimeout(() => emits('submit'), 1500)
        }
      })
    }
  })
}

// 初始化方法
const init = async () => {
  queryPrecincts({ companyCode: props.companyCode }).then((res: any) => {
    state.orgOptions = res.data
  })
  state.formData.companyCode = props.companyCode
}
init()
</script>

<style lang="scss" scoped>
.my-form-box {
  :deep(.el-cascader) {
    .el-input__inner {
      width: 226px;
      height: 30px !important;
    }
  }
}
.form-date-box {
  :deep(.el-form-item__content) {
    width: 129px;
  }
  :deep(.el-input__wrapper) {
    width: 110px;
    padding-right: 9px;
  }
}
</style>
