<!-- eslint-disable vue/no-mutating-props -->
<template>
  <dialog-component
    :dialog-visible="dialogVisible"
    :size="380"
    title="新增/编辑应用应用"
    @close-dialog="handleCancle"
    @save-dialog="saveDialog"
  >
    <div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="my-form-box2">
        <el-form-item label="企业:" prop="companyCode">
          <el-select
            v-model="ruleForm.companyCode"
            :disabled="editId ? true : false"
            placeholder="请选择企业"
          >
            <el-option
              v-for="item in companyList"
              :key="item.companyCode"
              :label="`${item.companyCode} - ${item.companyName}`"
              :value="item.companyCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用编码:" prop="code">
          <el-input v-model="ruleForm.code" :disabled="editId ? true : false" placeholder="请输入应用编码" />
        </el-form-item>
        <el-form-item label="应用名称:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
  </dialog-component>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { verifySystemName, verifySystemCode, addApplcationInfo, editApplcationInfo } from '../api'
import useScrollStore from '@/store/modules/scrollTab'
import { useProxy } from '@/utils/proxy'
const { proxy } = useProxy()
const props = defineProps({
  dialogVisible: {
    // 编辑框是否显示
    type: Boolean,
    default: false
  },
  editId: {
    type: String,
    default: ''
  }
})
const scrollStore = useScrollStore()
const companyList = computed(() => scrollStore.companyList)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  companyCode: '',
  code: '',
  name: '',
  description: ''
})

const validatePass = async (rule: any, value: any, callback: any) => {
  if (value) {
    const isExist: any = await verifySystemName({
      name: ruleForm.name,
      id: props.editId,
      companyCode: ruleForm.companyCode
    })
    if (isExist.data) {
      callback(new Error('应用名称不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}
const validateCode = async (rule: any, value: any, callback: any) => {
  if (value && !props.editId) {
    const isExist: any = await verifySystemCode({
      code: ruleForm.code
    })
    if (isExist.data) {
      callback(new Error('应用编码不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}
const rules = reactive({
  companyCode: [{ required: true, message: '请选择企业', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入应用编码', trigger: 'blur' },
    { validator: validateCode, trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
}) as FormRules

const emits = defineEmits(['handleAdded', 'handleCancle'])

// 保存
const saveDialog = async () => {
  await ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (props.editId) {
        let info = {
          name: ruleForm.name,
          description: ruleForm.description
        }
        editApplcationInfo(props.editId, info).then((res: any) => {
          if (res.code == '200000') {
            proxy.$message.msgSuccess('编辑成功')
            handleCancle()
            emits('handleAdded')
          }
        })
      } else {
        addApplcationInfo(ruleForm).then((res: any) => {
          if (res.code == '200000') {
            proxy.$message.msgSuccess('新增成功')
            handleCancle()
            emits('handleAdded')
          }
        })
      }
    }
  })
}

const handleCancle = () => {
  ruleForm.companyCode = ''
  ruleForm.code = ''
  ruleForm.name = ''
  ruleForm.description = ''
  emits('handleCancle')
}
defineExpose({ ruleForm })
</script>
<style scoped></style>
