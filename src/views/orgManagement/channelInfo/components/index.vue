<template>
  <dialog-component
    :dialog-visible="state.show"
    :size="380"
    title="新增/编辑渠道信息"
    @close-dialog="handleClose()"
    @save-dialog="handleSubmit()"
  >
    <el-form
      ref="formRef"
      class="my-form-box2"
      :model="state.formData"
      :rules="state.formRules"
      label-width="102px"
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
      <el-form-item label="父级渠道:" prop="parentChannelsCode">
        <el-tree-select
          v-model="state.formData.parentChannelsCode"
          :disabled="(state.editId ? true : false) || (state.sourceParentCode ? true : false)"
          :data="channelData"
          :default-expand-all="true"
          node-key="channelsCode"
          check-strictly
          clearable
          :placeholder="state.editId ? ' ' : '请选择父级渠道'"
          :props="{ value: 'channelsCode', label: getTreeLableFunc, children: 'channels' }"
        />
      </el-form-item>
      <el-form-item label="渠道编码:" prop="channelsCode">
        <el-input
          v-model="state.formData.channelsCode"
          :disabled="state.editId ? true : false"
          placeholder="请输入渠道编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道名称:" prop="name">
        <el-input v-model="state.formData.name" placeholder="请输入渠道名称"></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-switch v-model="state.formData.status"></el-switch>
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getChannelById, validateNameExist, validateCodeExist, modifyChannel, addChannel } from '../api'
import { validCode } from '@/utils/validate'
import { useProxy } from '@/utils/proxy'
import useScrollStore from '@/store/modules/scrollTab'
const validateName = async (rule: any, value: any, callback: any) => {
  if (value) {
    const isExist: any = await validateNameExist({
      name: state.formData.name,
      id: state.editId,
      companyCode: state.formData.companyCode
    })
    if (isExist.data) {
      callback(new Error('渠道名称不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}

const validateCode = async (rule: any, value: any, callback: any) => {
  if (value && !state.editId) {
    const isExist: any = await validateCodeExist({
      channelsCode: state.formData.channelsCode,
      companyCode: state.formData.companyCode
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
  channelData: {
    type: Array,
    default: () => []
  }
})
const scrollStore = useScrollStore()
const emit = defineEmits(['handleAdded'])
const { proxy } = useProxy()
const formRef = ref<FormInstance>()
const companyList = computed(() => scrollStore.companyList)
const state = reactive({
  show: false,
  isSubmiting: false,
  sourceParentCode: '',
  editId: '',
  formData: { companyCode: '', parentChannelsCode: '', channelsCode: '', name: '', status: true },
  formRules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'blur' }],
    channelsCode: [
      { required: true, message: '请输入渠道编码', trigger: 'blur' },
      { validator: validCode, trigger: 'blur' },
      { validator: validateCode, trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入渠道名称', trigger: 'blur' },
      { max: 64, message: '输入字符不得超过64位', trigger: 'blur' },
      { validator: validateName, trigger: 'blur' }
    ]
  } as FormRules
})
// 关闭回调
const handleClose = () => {
  state.editId = ''
  state.sourceParentCode = ''
  state.formData = { companyCode: '', parentChannelsCode: '', channelsCode: '', name: '', status: true }
  state.show = false
}
// 设置tree选项显示
const getTreeLableFunc = (item: any) => {
  return `${item.channelsCode}-${item.name}`
}
// 获取详情
const getRelationTypeDetail = async () => {
  let { data } = await getChannelById<any>(state.editId)
  const form = {} as any
  Object.keys(state.formData).forEach((item, index) => {
    if (item == 'parentChannelsCode') {
      form[item] = state.sourceParentCode == '0' ? '' : state.sourceParentCode
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
      const params = { ...state.formData } as any
      state.isSubmiting = true
      if (state.editId) {
        delete params.channelsCode
        modifyChannel(state.editId, params)
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
        addChannel(params)
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
defineExpose({ state, getRelationTypeDetail })
</script>

<style lang="scss" scoped></style>
