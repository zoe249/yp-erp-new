<template>
  <dialog-component
    title="新增/编辑企业信息"
    :dialog-visible="dialogVisible"
    :size="650"
    @close-dialog="close"
    @save-dialog="submit"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :label-width="'90px'"
      class="my-form-box2"
      :form-data="state.formData"
      :rules="state.formRules"
    >
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item prop="companyCode" label="企业编码：">
            <el-input v-model="state.formData.companyCode" placeholder="请输入企业编码" />
          </el-form-item>
        </el-col>
        <el-col :span="state.colSpan">
          <el-form-item prop="companyName" label="企业名称：">
            <el-input v-model="state.formData.companyName" placeholder="请输入企业名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item prop="contacts" label="联系人：">
            <el-input v-model="state.formData.contacts" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="state.colSpan">
          <el-form-item prop="phone" label="联系电话：">
            <el-input v-model="state.formData.phone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item prop="status" label="状态：">
            <el-switch v-model="state.formData.status" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="state.gutter">
        <div class="df aic">
          <el-form-item prop="province" label="地址：">
            <el-select
              v-model="state.area.province"
              value-key="id"
              @change="addressChange($event, 'cityOptions')"
            >
              <el-option
                v-for="item in state.provinceOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="city" label="">
            <el-select
              v-model="state.area.city"
              value-key="id"
              @change="addressChange($event, 'areaOptions')"
            >
              <el-option v-for="item in state.cityOptions" :key="item.id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item prop="district" label="">
            <el-select v-model="state.area.district" value-key="id" @change="addressChange($event, 'null')">
              <el-option
                v-for="item in state.areaOptions"
                :key="item.id"
                :label="item.fullname"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="street" label="">
            <el-input v-model="state.area.street" placeholder="请输入街道"></el-input>
          </el-form-item>
        </div>
      </el-row>
      <div class="address">
        <el-form-item prop="address" label="地址：">
          <el-input v-model="state.formData.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </dialog-component>
</template>

<script setup lang="ts">
import { checkCode, getDetailById, addSubmit, editCompanyById } from '../api'
import type { FormInstance } from 'element-plus'
import { jsonp } from 'vue-jsonp'
import { useProxy } from '@/utils/proxy'
import { validatePhone } from '@/utils/validate'
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
  }
})

const validateCode = (rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_-]{3,16}$/
  if (value === '') {
    callback(new Error('请输入企业编码'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入30个字符以内的编码'))
  } else if (!props.rowId) {
    checkCode(value).then((res: any) => {
      if (res.data) {
        callback(new Error('企业编码不允许重复'))
      } else {
        callback()
      }
    })
  } else {
    callback()
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入企业名称'))
  } else if (value.length > 30) {
    callback(new Error('企业名称不允许超过30个字符'))
  } else {
    callback()
  }
}

const state = reactive({
  formData: {
    companyCode: '',
    companyName: '',
    contacts: '',
    phone: '',
    address: '',
    status: true
  } as { [key: string]: any },
  formRules: {
    companyCode: { required: true, validator: validateCode, trigger: 'blur' },
    companyName: { required: true, validator: validateName, trigger: 'blur' },
    phone: { validator: validatePhone, trigger: 'blur' },
    status: { required: true, message: '请选择状态', trigger: 'blur' }
  },
  colSpan: 12,
  gutter: 20,
  area: {
    province: {},
    city: {},
    district: {},
    street: ''
  },
  provinceOptions: [] as TsearchItem[],
  cityOptions: [] as TsearchItem[],
  areaOptions: [] as TsearchItem[]
})

const formRef = ref<FormInstance>()

const getDetail = () => {
  if (!props.rowId) return
  getDetailById(props.rowId).then((res: any) => {
    Object.keys(state.formData).forEach((key: string) => {
      state.formData[key] = res.data[key]
    })
  })
}

/* 获取省份信息 */
const getStateOptions = () => {
  jsonp('https://apis.map.qq.com/ws/district/v1/list', {
    key: '772BZ-QC7WF-OHJJG-J7V3W-ZGJEV-3FFFE',
    output: 'jsonp'
  }).then((res) => {
    state.provinceOptions = res.result.length && res.result[0]
  })
}

const addressChange = (item: any, type: 'null' | 'areaOptions' | 'cityOptions') => {
  if (type === 'null') return
  if (type === 'cityOptions') {
    state.area.district = {}
    state.area.city = {}
  } else if (type === 'areaOptions') {
    state.formData.district = {}
  }
  jsonp('https://apis.map.qq.com/ws/district/v1/getchildren', {
    key: '772BZ-QC7WF-OHJJG-J7V3W-ZGJEV-3FFFE',
    id: item.id,
    output: 'jsonp',
    get_polygon: 2,
    max_offset: 1000
  }).then((res: any) => {
    state[type] = res && res.result && res.result[0]
  })
}

const close = () => {
  emits('close')
}
const submit = () => {
  formRef.value?.validate((valid: any, fields: any) => {
    if (valid) {
      if (!props.rowId) {
        addSubmit(state.formData).then((res: any) => {
          if (res.code === '200000') {
            proxy.$message.msgSuccess('新增成功')
            setTimeout(() => emits('submit'), 1500)
          }
        })
      } else {
        const { companyCode, ...params } = state.formData
        editCompanyById(props.rowId, params).then((res: any) => {
          if (res.code === '200000') {
            proxy.$message.msgSuccess('修改成功')
            setTimeout(() => emits('submit'), 1500)
          }
        })
      }
    }
  })
}

const init = () => {
  getDetail()
  getStateOptions()
}
init()
</script>

<style lang="scss" scoped>
.aic {
  display: none;
  &:nth-child(1) {
    margin-left: 10px;
  }
  :deep(.el-form-item__content) {
    width: 110px;
    padding-right: 12px;
    margin-left: 0 !important;
  }
}
.address {
  width: 100%;
  :deep(.el-form-item__content) {
    width: calc(100% - 100px);
  }
}
</style>
