<template>
  <dialog-component
    :dialog-visible="dialogVisible"
    :title="title"
    :size="400"
    @save-dialog="saveDialog(formRef)"
    @close-dialog="emits('closeDialog')"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-width="110px"
      class="my-form-box2"
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
          <el-form-item label="门店编码:" prop="organizationCode">
            <el-input
              v-model="state.formData.organizationCode"
              clearable
              :disabled="userInfo.organizationType === '03'"
              placeholder="请输入门店编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="店铺编码:" prop="storeCode">
            <el-select
              v-model="state.formData.storeCode"
              placeholder="请选择店铺编码"
              clearable="true"
              @visible-change="getStores($event)"
            >
              <el-option
                v-for="item in state.storesOptions"
                :key="item.storeCode"
                :label="`${item.storeCode}-${item.storeCodeDescr}`"
                :value="item.storeCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道编码:" prop="channelsCode">
            <el-tree-select
              v-model.trim="state.formData.channelsCode"
              placeholder="请选择渠道编码"
              default-expand-all
              node-key="id"
              :data="state.channelDataOptions"
              :filter-method="filterMethod"
              :props="{ label: 'codeAndName', value: 'channelsCode', children: 'channels' }"
              filterable
              check-strictly
              :render-after-expand="false"
              @visible-change="getChannelData($event)"
            />
          </el-form-item>
          <el-form-item label="状态:">
            <el-switch v-model="state.formData.status"></el-switch>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </dialog-component>
</template>

<script lang="ts" setup name="AddForm">
import useTabStore from '@/store/modules/scrollTab'
import { addSubmit, queryChannels, queryStores, validateRepeat } from '../api'
import { useProxy } from '@/utils/proxy'
import { FormInstance } from 'element-plus'
import useUserStore from '@/store/modules/user'
import useScrollStore from '@/store/modules/scrollTab'

interface IformData {
  companyCode: string
  organizationCode: string | any
  storeCode: string
  channelsCode: string
  status: boolean
}
interface Ichannels {
  channelsCode: string
  name: string
  [propName: string]: any
}
const { proxy } = useProxy()
const formRef = ref<FormInstance>()
const companyOptions = useScrollStore().companyList
// 组织类型为03时表示门店人员
const userInfo = useUserStore().userInfo

const props = defineProps({
  title: {
    type: String,
    default: '店铺渠道'
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
})
const state = reactive({
  formData: {
    companyCode: '',
    organizationCode: '',
    storeCode: '',
    channelsCode: '',
    status: true
  } as IformData,
  formRules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'change' }],
    organizationCode: [{ required: true, message: '请输入门店编码', trigger: 'change' }],
    storeCode: [{ required: true, message: '请选择店铺编码', trigger: 'change' }],
    channelsCode: [{ required: true, message: '请选择渠道编码', trigger: 'change' }]
  },
  storesOptions: [] as any,
  channelDataOptions: [] as any
})

const emits = defineEmits(['closeDialog', 'refreshList'])
// 验证是否重复
const checkRepeat = (): any => {
  let _param = {
    channelsCode: state.formData.channelsCode,
    organizationCode: state.formData.organizationCode,
    storeCode: state.formData.storeCode,
    companyCode: state.formData.companyCode
  }
  validateRepeat(_param).then((res: any) => {
    return res.data
  })
}
const getJoinChannels = <T>(arr: Array<Ichannels>) => {
  let newArr = [] as Array<Ichannels>
  arr.forEach((ele: Ichannels) => {
    ele.codeAndName = `${ele.channelsCode} - ${ele.name}`
    newArr.push(ele)
    if (ele.channels?.length) {
      getJoinChannels(ele.channels)
    }
  })
  return newArr
}
// 获取渠道编码
const getChannelData = (bol: boolean) => {
  if (bol) {
    // 从哪一级开始查询，传递需要查询的父ID（0和不传默认顶级）
    queryChannels({ parentChannelsCode: '0', companyCode: state.formData.companyCode }).then((res: any) => {
      state.channelDataOptions = getJoinChannels(res.data) || []
    })
  }
}
const filterMethod = (value: string) => {
  state.channelDataOptions = [...state.channelDataOptions].filter((item: any) => item.name.includes(value))
}
const saveDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      let flag = checkRepeat()
      if (flag) return proxy.$message.msgError('同一个门店+店铺+渠道只能有一个')
      addSubmit(state.formData).then((res: any) => {
        emits('closeDialog')
        emits('refreshList')
      })
    }
  })
}
// 通过门店获取有效的店铺
const getStores = (bol: boolean) => {
  // bol 展示下拉面板时才调用接口
  if (!bol) return
  if (!state.formData.organizationCode) return proxy.$message.msgWarning('请先输入门店编码获取数据')
  state.storesOptions = []
  let param = {
    companyCode: state.formData.companyCode,
    status: true,
    organizationCode: state.formData.organizationCode
  }
  queryStores(param).then((res) => {
    state.storesOptions = res.data || []
  })
}
const init = () => {
  // 门店人员，直接赋值门店编码
  if (userInfo.organizationType === '03') {
    state.formData.organizationCode = userInfo.organizationCode
  }
}
init()
// 门店编码变动时，清除店铺编码
watch(
  () => state.formData.organizationCode,
  (val: string) => {
    if (val || val === '') {
      state.formData.storeCode = ''
    }
  }
)
defineExpose({
  state
})
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
</style>
