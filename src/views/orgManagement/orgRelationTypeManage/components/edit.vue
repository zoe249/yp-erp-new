<template>
  <dialog-component
    title="新增/编辑组织关系类型"
    :dialog-visible="dialogVisible"
    :size="400"
    @close-dialog="close"
    @save-dialog="submit"
    ><el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-width="110px"
      class="my-form-box2"
    >
      <el-form-item label="企业：" prop="companyCode">
        <el-select v-model="state.formData.companyCode" disabled>
          <el-option
            v-for="item in state.companyOptions"
            :key="item.companyCode"
            :label="`${item.companyCode} - ${item.companyName}`"
            :value="item.companyCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型编码：" prop="organizationRelationTypeCode">
        <el-input
          v-model="state.formData.organizationRelationTypeCode"
          placeholder="请输入类型编码"
          :disabled="!!rowId"
        />
      </el-form-item>
      <el-form-item label="类型名称：" prop="name">
        <el-input v-model="state.formData.name" placeholder="请输入类型名称" />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="state.formData.status" />
      </el-form-item>
      <el-form-item label="规则说明：" prop="description">
        <el-input v-model="state.formData.description" type="textarea" placeholder="请输入规则说明" />
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import { orgCheckName, orgCheckCode, getDetailById, addSubmit, editById } from '../api'
import { ElForm } from 'element-plus'
import { useProxy } from '@/utils/proxy'
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
  companyCode: {
    type: String,
    default: ''
  },
  companyOptions: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['cancel', 'submit'])

/** 校验编码 */
const validateCode = (rule: any, value: any, callback: any) => {
  const reg = /^[0-9a-zA-Z]*$/g
  if (value === '') {
    callback(new Error('请输入类型编码'))
  } else {
    if (!reg.test(value)) {
      callback(new Error(rule?.message || '请输入正确编码，只能由字母和数字组成'))
    } else if (value.length > 64) {
      callback(new Error('字符长度不得超过64位'))
    } else if (!props.rowId) {
      orgCheckCode({
        organizationRelationTypeCode: value,
        companyCode: state.formData.companyCode
      }).then((res) => {
        if (res.data) {
          callback(new Error('类型编码不允许重复'))
        } else {
          callback()
        }
      })
    } else {
      callback()
    }
  }
}
/** 校验名称 */
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入类型名称'))
  } else if (value.length > 30) {
    callback(new Error('名称长度不得超过30位'))
  } else {
    orgCheckName({ name: value, companyCode: state.formData.companyCode, id: props.rowId }).then((res) => {
      if (res.data) {
        callback(new Error('类型名称不允许重复'))
      } else {
        callback()
      }
    })
  }
}
const formRef = ref<InstanceType<typeof ElForm>>()
const state = reactive({
  formData: {
    companyCode: '',
    organizationRelationTypeCode: '',
    name: '',
    status: true,
    description: ''
  },
  formRules: {
    companyCode: { required: true, message: '请选择企业', trigger: 'change' },
    organizationRelationTypeCode: { required: true, validator: validateCode, trigger: 'blur' },
    name: { required: true, validator: validateName, trigger: 'blur' },
    status: { required: true, message: '请选择状态', trigger: 'change' }
  },

  companyOptions: [] as Array<any>
})

const getDetail = () => {
  if (props.rowId) {
    getDetailById(props.rowId).then((res: any) => {
      Object.keys(state.formData).forEach((key: string) => {
        ;(state.formData as any)[key] = res.data[key]
      })
    })
  } else {
    state.formData = {
      companyCode: props.companyCode,
      organizationRelationTypeCode: '',
      name: '',
      status: true,
      description: ''
    }
  }
}
const close = () => {
  emits('cancel')
}

const submit = () => {
  formRef.value?.validate((valid: any, fields: any) => {
    if (!valid) return
    if (!props.rowId) {
      addSubmit(state.formData).then((res: any) => {
        if (res.code === '200000') {
          proxy.$message.msgSuccess('新增成功')
          setTimeout(() => emits('submit'), 1500)
        }
      })
    } else {
      const { organizationRelationTypeCode, ...params } = state.formData
      editById(props.rowId, params).then((res: any) => {
        if (res.code === '200000') {
          proxy.$message.msgSuccess('修改成功')
          setTimeout(() => emits('submit'), 1500)
        }
      })
    }
  })
}

const init = () => {
  state.companyOptions = props.companyOptions
  getDetail()
}
init()
</script>

<style lang="scss" scoped></style>
