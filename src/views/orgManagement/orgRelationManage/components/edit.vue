<template>
  <dialog-component
    title="修改组织关系"
    :dialog-visible="dialogVisible"
    :size="500"
    @close-dialog="close"
    @save-dialog="submit"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-width="120px"
      class="my-form-box"
    >
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
      <el-form-item label="组织关系类型：" prop="organizationRelationTypeCode">
        <el-input v-model="state.formData.organizationRelationTypeCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="state.formData.status" />
      </el-form-item>
      <el-form-item label="父级组织：" prop="parentOrganizationCode">
        <el-input v-model="state.formData.parentOrganizationCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="组织：" prop="organizationCode">
        <el-input v-model="state.formData.organizationCode" disabled></el-input>
      </el-form-item>
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
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import { getDetailById, editById } from '../api'
import { useDateDisable } from '@/hooks/dateDisable'
import { useProxy } from '@/utils/proxy'
import { formatDate } from '@/utils'
import type { FormInstance } from 'element-plus'
const { proxy } = useProxy()
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  rowId: {
    type: String,
    default: ''
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
const state = reactive({
  formData: {
    companyCode: '',
    organizationRelationTypeCode: '',
    status: true,
    parentOrganizationCode: '',
    organizationCode: '',
    beginTime: '',
    endTime: ''
  } as { [key: string]: any },
  formRules: {}
})

const formRef = ref<FormInstance>()

// 时间组件 hooks
const { datePlaceholder, handleBeginTime, handleEndTime, disabledBegin, disabledEnd } = useDateDisable(
  state,
  props.dateTime
)

const close = () => {
  emits('cancel')
}

const submit = () => {
  const params = {
    status: state.formData.status,
    beginTime: formatDate(state.formData.beginTime),
    endTime: formatDate(state.formData.endTime)
  }
  formRef.value?.validate((valid: any, fields: any) => {
    if (valid) {
      editById(props.rowId, params).then((res: any) => {
        if (res.code === '200000') {
          proxy.$message.msgSuccess('修改成功')
          setTimeout(() => emits('submit'), 1500)
        }
      })
    }
  })
}

/**
 * 根据id获取详情
 */
const getDetail = () => {
  getDetailById(props.rowId).then((res: any) => {
    Object.keys(state.formData).forEach((key: string) => {
      state.formData[key] = res.data[key]
      if (
        key === 'parentOrganizationCode' ||
        key === 'organizationCode' ||
        key === 'organizationRelationTypeCode'
      ) {
        if (res.data[key] && res.data[key + 'Descr']) {
          state.formData[key] = res.data[key] + '-' + res.data[key + 'Descr']
        }
      }
    })
  })
}

const init = () => {
  getDetail()
  state.formData.companyCode = props.companyCode
}
init()
</script>

<style lang="scss" scoped>
.form-date-box {
  :deep(.el-form-item__content) {
    width: 129px;
  }
  :deep(.el-input__wrapper) {
    width: 108px;
    padding-right: 9px;
  }
}
</style>
