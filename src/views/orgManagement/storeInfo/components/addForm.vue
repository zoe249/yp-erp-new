<template>
  <dialog-component
    :dialog-visible="dialogVisible"
    :title="title"
    :size="450"
    @save-dialog="saveDialog(formRef)"
    @close-dialog="emits('closeDialog')"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-width="110px"
      class="my-form-box"
    >
      <div class="flex-line">
        <div class="flex-line-left">
          <el-form-item label="企业:" prop="companyCode">
            <el-select v-model="state.formData.companyCode" placeholder="请选择企业" disabled>
              <el-option
                v-for="item in companyOptions"
                :key="item.companyCode"
                :label="`${item.companyCode}-${item.companyName}`"
                :value="item.companyCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺类型:" prop="type">
            <el-select v-model="state.formData.type" placeholder="请选择店铺类型" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺编码:" prop="storeCode">
            <el-input
              v-model="state.formData.storeCode"
              clearable
              :disabled="!!id"
              placeholder="请输入店铺编码"
              @blur="checkRepeatStoreCode(state.formData.storeCode)"
            ></el-input>
          </el-form-item>
          <el-form-item label="店铺名称:" prop="name">
            <el-input
              v-model="state.formData.name"
              placeholder="请输入店铺名称"
              clearable
              @blur="checkRepeatStoreName(state.formData.name)"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-switch v-model="state.formData.status"></el-switch>
          </el-form-item>
          <el-form-item label="必有店铺">
            <el-checkbox v-model="state.formData.necessary" style="margin-right: 8px"></el-checkbox>
            <span class="tips">勾选后每个新增门店都会自动增加该店铺</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </dialog-component>
</template>

<script lang="ts" setup name="AddForm">
import useTabStore from '@/store/modules/scrollTab'
import { addSubmit, editSubmit, getDetail, validateStoreCode, validateStoreName } from '../api'
import { useProxy } from '@/utils/proxy'
import type { FormInstance } from 'element-plus'
import useScrollStore from '@/store/modules/scrollTab'
import { validCode } from '@/utils/validate'

const { proxy } = useProxy()
const companyOptions = useScrollStore().companyList
const formRef = ref<FormInstance>()
const props = defineProps({
  title: {
    type: String,
    default: '店铺信息'
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  typeOptions: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const state = reactive({
  formData: {
    companyCode: '',
    type: '',
    storeCode: '',
    name: '',
    status: true,
    necessary: false
  },
  formRules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'blur' }],
    type: [{ required: true, message: '请选择店铺类型', trigger: 'blur' }],
    storeCode: [{ required: true, message: '请输入店铺编码', trigger: 'blur' }, { validator: validCode }],
    name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }]
  }
})

const emits = defineEmits(['closeDialog', 'refreshList'])
const saveDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      if (props.id) {
        // 有id为编辑
        editSubmit(props.id, state.formData).then((res: any) => {
          emits('closeDialog')
          emits('refreshList')
        })
      } else {
        // 无id为新增
        addSubmit(state.formData).then((res: any) => {
          emits('closeDialog')
          emits('refreshList')
        })
      }
    }
  })
}
// 获取详情
const getDetailById = (id: string) => {
  getDetail<any>(id).then((res) => {
    state.formData = res.data
  })
}
// 验证店铺编码是否重复
const checkRepeatStoreCode = (val: string) => {
  if (val === '') return
  let _param = {
    storeCode: state.formData.storeCode,
    id: props.id,
    companyCode: state.formData.companyCode
  }
  validateStoreCode(_param).then((res: any) => {
    // 校验重复return, 反之查询店铺信息
    if (res.data) {
      state.formData.storeCode = ''
      return proxy.$message.msgError('该店铺编码已存在！')
    }
  })
}
// 校验店铺名称是否重复
const checkRepeatStoreName = (val: string) => {
  if (val === '') return
  let _param = {
    name: state.formData.name,
    id: props.id,
    companyCode: state.formData.companyCode
  }
  validateStoreName(_param).then((res: any) => {
    if (res.data) {
      state.formData.name = ''
      return proxy.$message.msgError('该店铺名称已存在！')
    }
  })
}
defineExpose({
  state
})
watch(
  () => props.id,
  (val) => {
    // 新增 不调用详情接口
    if (!val) return
    getDetailById(props.id)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.flex-line {
  width: 100%;
  display: flex;
  align-items: flex-start;
  &-left {
    width: 50%;
  }
  &-right {
    width: 50%;
    :deep(.el-form-item__content) {
      flex: 1;
    }
    :deep(.el-tree) {
      width: 100%;
      min-height: 350px;
      overflow: auto;
      margin-top: 10px;
    }
    :deep(.el-form-item__content) {
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
}
.tips {
  font-size: 12px;
  color: $blue;
}
.my-form-box {
  :deep(.el-form-item__content) {
    width: 240px !important;
  }
}
</style>
