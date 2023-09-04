<template>
  <dialog-component
    :dialog-visible="state.show"
    :size="380"
    title="新增/编辑管理区域"
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
      <el-form-item label="企业:" prop="companyCode">
        <el-select v-model="state.formData.companyCode" disabled>
          <el-option
            v-for="item in companyList"
            :key="item.companyCode"
            :label="`${item.companyCode} - ${item.companyName}`"
            :value="item.companyCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父级区域:" prop="parentPrecinctCode">
        <el-tree-select
          v-model="state.formData.parentPrecinctCode"
          :disabled="(state.editId ? true : false) || (state.sourceParentCode ? true : false)"
          :data="areaTreeData"
          :default-expand-all="true"
          node-key="precinctCode"
          check-strictly
          clearable
          :placeholder="state.editId ? ' ' : '请选择父级区域'"
          :props="{ value: 'precinctCode', label: getTreeLableFunc, children: 'precinct' }"
        />
      </el-form-item>
      <el-form-item label="区域编码:" prop="precinctCode">
        <el-input
          v-model="state.formData.precinctCode"
          :disabled="state.editId ? true : false"
          placeholder="请输入区域编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="区域名称:" prop="name">
        <el-input v-model="state.formData.name" placeholder="请输入区域名称"></el-input>
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getAreaById, areaExistName, areaExistCode, editArea, addArea } from '../api'
import { validCode } from '@/utils/validate'
import { useProxy } from '@/utils/proxy'
import useScrollStore from '@/store/modules/scrollTab'
const validateName = async (rule: any, value: any, callback: any) => {
  if (value) {
    const isExist: any = await areaExistName({
      name: state.formData.name,
      id: state.editId
    })
    if (isExist.data) {
      callback(new Error('区域名称不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}

const validateCode = async (rule: any, value: any, callback: any) => {
  if (value && !state.editId) {
    const isExist: any = await areaExistCode({
      precinctCode: state.formData.precinctCode
    })
    if (isExist.data) {
      callback(new Error('编码不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}
const props = defineProps({
  areaTreeData: {
    type: Array,
    default: () => []
  }
})
const scrollStore = useScrollStore()
const companyList = computed(() => scrollStore.companyList)
const emit = defineEmits(['handleAdded'])
const { proxy } = useProxy()
const formRef = ref<FormInstance>()
const state = reactive({
  show: false,
  isSubmiting: false,
  sourceParentCode: '',
  editId: '',
  formData: { companyCode: '', parentPrecinctCode: '', precinctCode: '', name: '' },
  formRules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'blur' }],
    precinctCode: [
      { required: true, message: '请输入区域编码', trigger: 'blur' },
      { validator: validCode, trigger: 'blur' },
      { validator: validateCode, trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入区域名称', trigger: 'blur' },
      { max: 64, message: '输入字符不得超过64位', trigger: 'blur' },
      { validator: validateName, trigger: 'blur' }
    ]
  } as FormRules
})
// 关闭回调
const handleClose = () => {
  state.editId = ''
  state.sourceParentCode = ''
  state.formData = { companyCode: '', parentPrecinctCode: '', precinctCode: '', name: '' }
  state.show = false
}
// 设置tree选项显示
const getTreeLableFunc = (item: any) => {
  return `${item.precinctCode}-${item.name}`
}
// 获取详情
const getAreaDetail = async () => {
  let { data } = await getAreaById<any>(state.editId)
  const form = {} as any
  Object.keys(state.formData).forEach((item, index) => {
    if (item == 'parentPrecinctCode') {
      form[item] = data[item] == '0' ? '' : data[item]
    } else {
      form[item] = data[item] ?? ''
    }
  })
  state.formData = form
}
// 保存
const handleSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      state.isSubmiting = true
      if (state.editId) {
        editArea(state.editId, {
          parentPrecinctCode: state.formData.parentPrecinctCode || '0',
          name: state.formData.name,
          companyCode: state.formData.companyCode
        })
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
        addArea({ ...state.formData, parentPrecinctCode: state.formData.parentPrecinctCode || '0' })
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
  })
}
defineExpose({ state, getAreaDetail })
</script>

<style lang="scss" scoped></style>
