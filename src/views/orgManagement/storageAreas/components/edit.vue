<template>
  <dialog-component
    title="新增/编辑库区信息"
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
      <el-form-item
        v-for="item in state.formItem"
        :key="item.prop"
        :label="item.label + '：'"
        :prop="item.prop"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="state.formData[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="state.formData[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        >
          <el-option
            v-for="opt in item.selectOptions"
            :key="opt.code"
            :label="`${opt.code}-${opt.name}`"
            :value="opt.code"
          />
        </el-select>
        <el-switch v-else-if="item.type === 'switch'" v-model="state.formData[item.prop]" />
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import { initSearchItem, DicsObj } from '@/hooks/dicsData'
import { formItem } from '../config'
import { getDetailById, addSubmit, checkByCode, editById } from '../api'
import { ElForm } from 'element-plus'
import { useProxy } from '@/utils/proxy'

const { proxy } = useProxy()
const emits = defineEmits(['close', 'submit'])
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
const formRef = ref<InstanceType<typeof ElForm>>()

const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入类型名称'))
  } else if (value.length > 30) {
    callback(new Error('名称长度不得超过30位'))
  } else {
    callback()
  }
}
const state: { [key: string]: string | any } = reactive({
  formData: {
    companyCode: '',
    organizationCode: '',
    type: '',
    storageAreaCode: '',
    name: '',
    status: false
  },
  formItem,
  formRules: {
    companyCode: { required: true, message: '请选择企业', trigger: 'change' },
    organizationCode: { required: true, message: '请输入门店编码', trigger: 'blur' },
    type: { required: true, message: '请选择库区类型', trigger: 'change' },
    storageAreaCode: { required: true, message: '请输入库区编码', trigger: 'blur' },
    name: { required: true, validator: validateName, trigger: 'blur' },
    status: { required: true }
  }
})

const getDetail = () => {
  if (!props.rowId) return
  getDetailById(props.rowId).then((res: any) => {
    Object.keys(state.formData).forEach((key: string) => {
      state.formData[key] = res.data[key]
      if (key === 'organizationCode') {
        if (res.data[key] && res.data[key + 'Descr']) {
          state.formData[key] = res.data[key] + '-' + res.data[key + 'Descr']
        }
      }
    })
    state.formItem.forEach((item: any) => {
      if (item.prop === 'organizationCode' || item.prop === 'storageAreaCode') {
        item.disabled = true
      }
    })
  })
}

const close = () => {
  emits('close')
}
const submit = () => {
  formRef.value?.validate((valid: any, fields: any) => {
    if (!valid) return
    if (!props.rowId) {
      checkByCode(state.formData.organizationCode, state.formData.storageAreaCode).then((res: any) => {
        if (res.data) {
          proxy.$message.msgWarning('相同门店下不允许存在相同编码的库区')
        } else {
          addSubmit([state.formData]).then((res: any) => {
            if (res.code === '200000') {
              proxy.$message.msgSuccess('新增成功')
              setTimeout(() => emits('submit'), 1500)
            }
          })
        }
      })
    } else {
      const { organizationCode, storageAreaCode, ...params } = state.formData
      editById(props.rowId, params).then((res: any) => {
        if (res.code === '200000') {
          proxy.$message.msgSuccess('修改成功')
          setTimeout(() => emits('submit'), 1500)
        }
      })
    }
  })
}

const init = async () => {
  state.formItem = await initSearchItem(state.formItem, { type: DicsObj.H002 })
  state.formItem[0].selectOptions = props.companyOptions.map((item: any) => {
    item.code = item.companyCode
    item.name = item.companyName
    return item
  })
  await getDetail()
  state.formData.companyCode = props.companyCode
}
init()
</script>

<style lang="scss" scoped></style>
