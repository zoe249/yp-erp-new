<template>
  <el-form
    ref="formRef"
    label-position="right"
    :model="state.formData"
    :rules="state.formRules"
    :label-width="'90px'"
    class="my-form-box2"
  >
    <div class="flex-line">
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
      <el-form-item label="组织类型:" prop="organizationType">
        <el-select
          v-model="state.formData.organizationType"
          placeholder="请选择组织类型"
          :disabled="currEditId ? true : false"
        >
          <el-option
            v-for="item in orgList"
            :key="item.code"
            :label="`${item.code}-${item.name}`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
    </div>
    <div class="flex-line">
      <el-form-item label="组织编号:" prop="organizationCode">
        <el-input
          v-model="state.formData.organizationCode"
          type="text"
          placeholder="请输入组织编号"
          :disabled="currEditId ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="组织名称:" prop="name">
        <el-input v-model="state.formData.name" type="text" placeholder="请输入组织名称"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="业态:" prop="formats">
      <el-select v-model="state.formData.formats" placeholder="请选择业态">
        <el-option
          v-for="item in formatsList"
          :key="item.code"
          :label="`${item.code}-${item.name}`"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="有效状态:" prop="status">
      <div class="df aic">
        <el-switch
          v-model="state.formData.status"
          :before-change="() => beforeStatusChange('status')"
        ></el-switch>
        <div class="message-text ml12">开启后前台可以正常销售</div>
      </div>
    </el-form-item>
    <el-form-item label="经营状态:" prop="managementForms">
      <div class="df aic">
        <el-switch
          v-model="state.formData.managementForms"
          :disabled="state.formData.status === false"
          :before-change="() => beforeStatusChange('managementForms')"
        ></el-switch>
        <div class="message-text ml12">开启后可以进行业务操作，但无法销售</div>
      </div>
    </el-form-item>
    <!-- 非门店状态下经营状态和撤店标记不展示 -->
    <div v-if="state.formData.organizationType === '03' && currEditId" class="flex-line">
      <el-form-item label="撤店状态:" prop="closeFlag">
        <el-switch
          v-model="state.formData.closeFlag"
          :before-change="beforeCloseChange"
          @change="changeCloseFlag"
        ></el-switch>
      </el-form-item>
      <el-form-item v-if="state.formData.closeTime" label="撤店时间" prop="closeTime">
        <el-date-picker
          v-model="state.formData.closeTime"
          type="datetime"
          disabled
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
          placeholder="撤店时间"
        />
      </el-form-item>
    </div>
    <el-form-item
      v-if="
        !currEditId && state.formData.organizationType === '03' && state.formData.managementForms === true
      "
      label="营业时间:"
    >
      <div
        v-for="(item, index) in state.formData.businessTime"
        :key="index"
        class="df aic"
        :style="{ 'margin-top': index == 0 ? '0px' : '20px' }"
      >
        <el-time-picker
          v-model="item.time"
          style="width: 220px"
          is-range
          range-separator="-"
          value-format="HH:mm"
          format="HH:mm"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :style="{
            marginRight: index === 0 && state.formData.businessTime.length >= 3 ? '26px' : '10px'
          }"
        />

        <div class="time-btn">
          <el-icon v-if="index === 0 && state.formData.businessTime.length < 3" @click="addTimeClick">
            <i class="iconfont icon-xinzengmian"></i>
          </el-icon>
          <el-icon v-else-if="index > 0" @click="minusTimeClick(index)">
            <i class="iconfont icon-jianshao1"></i>
          </el-icon>
        </div>
        <div v-if="index === 0" class="message-text ml12">可以维护三个时间段</div>
      </div>
    </el-form-item>
    <div class="df aic">
      <el-form-item class="short-item" label="联系人:" prop="contacts">
        <el-input v-model="state.formData.contacts" type="text" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="" label-width="11px" prop="phone">
        <el-input v-model="state.formData.phone" type="text" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="" label-width="11px" prop="email">
        <el-input v-model="state.formData.email" type="text" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
    </div>
    <div class="df aic">
      <el-form-item class="short-item" prop="state" label="地址:">
        <el-select
          v-model="state.formData.state"
          placeholder="选择省"
          value-key="id"
          @change="addressChange($event, 'cityOptions')"
        >
          <el-option v-for="item in state.provinceOptions" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item class="short-item" prop="city" label="" label-width="11px">
        <el-select
          v-model="state.formData.city"
          placeholder="选择市"
          value-key="id"
          @change="addressChange($event, 'areaOptions')"
        >
          <el-option v-for="item in state.cityOptions" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item class="short-item" prop="district" label="" label-width="11px">
        <el-select
          v-model="state.formData.district"
          placeholder="选择区"
          value-key="id"
          @change="addressChange($event, 'null')"
        >
          <el-option v-for="item in state.areaOptions" :key="item.id" :label="item.fullname" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item class="short-item" prop="street" label="" label-width="11px">
        <el-input v-model="state.formData.street" type="text" placeholder="请输入街道"></el-input>
      </el-form-item>
    </div>
    <el-form-item class="address-item" label="详细地址:" prop="address">
      <el-input v-model="state.formData.address" type="text" placeholder="请输入详细地址"></el-input>
    </el-form-item>
    <div class="df aic">
      <el-form-item class="short-item" prop="longitude" label="坐标:">
        <el-input v-model="state.formData.longitude" type="text" placeholder="经度" disabled></el-input>
      </el-form-item>
      <el-form-item class="short-item" prop="location" label="" label-width="11px">
        <el-input v-model="state.formData.latitude" type="text" placeholder="纬度" disabled></el-input>
      </el-form-item>
    </div>
    <div id="container" class="map-box"></div>
  </el-form>
</template>

<script setup lang="ts">
import useScrollStore from '@/store/modules/scrollTab'
import { loadTMapScript, formatDate } from '@/utils/index'
import { validCode, validatePhone, validateEmail } from '@/utils/validate'
import type { FormInstance, FormRules } from 'element-plus'
import { jsonp } from 'vue-jsonp'
import { PropType } from 'vue'
import { useProxy } from '@/utils/proxy'
import { validateCodeExist, validateNameExist } from '../api'
const validateCode = async (rule: any, value: any, callback: any) => {
  if (value && !props.currEditId) {
    let exist: any = await validateCodeExist({
      organizationCode: state.formData.organizationCode
    })
    if (exist.data) {
      callback(new Error('组织信息编码不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}
const validateName = async (rule: any, value: any, callback: any) => {
  if (value) {
    const exist: any = await validateNameExist({
      name: state.formData.name,
      id: props.currEditId
    })
    if (exist.data) {
      callback(new Error('组织信息名称不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}
const props = defineProps({
  orgList: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  formatsList: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  currEditId: {
    type: String,
    default: ''
  },
  companyCode: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['nextStep'])
const formRef = ref<FormInstance>()
const { proxy } = useProxy()
const scrollStore = useScrollStore()
const companyList = computed(() => scrollStore.companyList)
const state = reactive({
  currLocation: {
    lat: 39.984104,
    lng: 116.307503
  },
  provinceOptions: [] as TsearchItem[],
  cityOptions: [] as TsearchItem[],
  areaOptions: [] as TsearchItem[],
  formData: {
    companyCode: '',
    organizationType: '',
    organizationCode: '',
    name: '',
    formats: '',
    status: true,
    managementForms: true,
    businessTime: [{ time: [] }] as any,
    contacts: '',
    phone: '',
    email: '',
    state: {},
    city: {},
    district: {},
    street: '',
    address: '',
    longitude: 116.307503,
    latitude: 39.984104,
    closeFlag: false,
    closeTime: ''
  },
  formRules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'change' }],
    organizationType: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
    organizationCode: [
      { required: true, message: '请输入组织信息编码', trigger: 'blur' },
      { validator: validCode, trigger: 'blur' },
      { validator: validateCode, trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入组织信息名称', trigger: 'blur' },
      { max: 64, message: '输入字符不得超过64位', trigger: 'blur' },
      { validator: validateName, trigger: 'blur' }
    ],
    formats: [{ required: true, message: '请选择业态', trigger: 'change' }],
    phone: [{ validator: validatePhone, trigger: 'blur' }],
    email: [{ validator: validateEmail, trigger: 'blur' }]
  } as FormRules,
  orgOptions: [] as TselectOptions[]
})
// 撤店标志打开时不允许打开经营状态
const beforeStatusChange = (type: 'status' | 'managementForms') => {
  if (state.formData.closeFlag === true && state.formData[type] === false) {
    proxy.$message.msgError(`撤店标志打开时不允许打开${type === 'status' ? '有效状态' : '经营状态'}`)
    return false
  } else {
    return true
  }
}
// 判断撤店标志能不能打开
const beforeCloseChange = () => {
  if (
    state.formData.closeFlag === false &&
    (state.formData.status === true || state.formData.managementForms === true)
  ) {
    proxy.$message.msgError('有效状态和经营状态开启， 不允许撤店')
    return false
  } else {
    return true
  }
}
// 修改撤店标志,撤店时间赋当前值
const changeCloseFlag = (val: unknown) => {
  if (val === false) {
    state.formData.closeTime = ''
  } else {
    state.formData.closeTime = formatDate(new Date())
  }
}
//经营时间操作
const addTimeClick = () => {
  if (state.formData.businessTime.length < 3) {
    const tempObj = { time: [] }
    state.formData.businessTime.push(tempObj)
  }
}

const minusTimeClick = (index: number) => {
  if (state.formData.businessTime.length > 1) {
    state.formData.businessTime.splice(index, 1)
  }
}
// 初始化地图
const setMapCenter = (location?: any, zoom?: any) => {
  let mapCenter = null
  loadTMapScript().then((TMap: any) => {
    mapCenter = new TMap.maps.LatLng(location.lat, location.lng)
    //初始化地图
    new TMap.maps.Map('container', {
      zoom, //设置地图缩放级别
      center: mapCenter //设置地图中心点坐标
    })
  })
}
// 选择地址回调
const addressChange = (item: any, type: 'null' | 'areaOptions' | 'cityOptions') => {
  state.currLocation = item.location
  state.formData.longitude = item.location.lng
  state.formData.latitude = item.location.lat
  setMapCenter(item.location, 12)
  if (type === 'null') return
  if (type === 'cityOptions') {
    state.formData.district = {}
    state.formData.city = {}
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
const getStateOptions = () => {
  jsonp('https://apis.map.qq.com/ws/district/v1/list', {
    key: '772BZ-QC7WF-OHJJG-J7V3W-ZGJEV-3FFFE',
    output: 'jsonp'
  }).then((res) => {
    state.provinceOptions = res.result.length && res.result[0]
  })
}
// ary转string
const aryToString = (array: any) => {
  if (!array || !(array[0].time[0] || array[0].time[1])) return ''
  let tempStr = ''
  array.forEach((item: any) => {
    tempStr += `${item.time[0]}-${item.time[1]};`
  })
  return tempStr
}
// 判断时间是否重复
const handleTime = (arr: any[], index: string) => {
  for (let i in arr) {
    if (index !== i) {
      let index0 = arr[Number(index)].time[0]
      let index1 = arr[Number(index)].time[1]
      let i0 = arr[i].time[0]
      let i1 = arr[i].time[1]

      if (i0 <= index0 && i1 > index0) {
        return false
      }
      if (i0 <= index1 && i1 >= index1) {
        return false
      }
    }
  }
  return true
}
// 校验多个时间段不能重复或重叠
const handleRepeatTime = (arr: any[]) => {
  for (let k in arr) {
    if (!handleTime(arr, k)) {
      return false
    }
  }
  return true
}
// 获取详情
const getOrgDetail = (data: any) => {
  if (!data) return
  let form = {} as any
  Object.keys(state.formData).forEach((item, index) => {
    form[item] = data[item] ?? ''
  })
  if (data.latitude && data.longitude) {
    state.currLocation.lat = data.latitude
    state.currLocation.lng = data.longitude
    setMapCenter(state.currLocation, 12)
  } else {
    setMapCenter(state.currLocation, 6)
  }
  state.formData = form
}
// 下一步
const nextSubmit = async () => {
  if (!handleRepeatTime(state.formData.businessTime)) {
    return proxy.$message.msgWarning('时间段不能重叠或重复，请重新选择')
  }

  const firstStepFormData = {
    ...state.formData,
    businessTime: aryToString(state.formData.businessTime)
  }
  if (
    firstStepFormData.organizationType === '03' &&
    !firstStepFormData.businessTime &&
    !props.currEditId &&
    state.formData.managementForms === true
  ) {
    return proxy.$message.msgError('组织类型为门店且经营状态开启时， 营业时间必填')
  }
  await formRef.value?.validate((valid) => {
    if (valid) {
      emit('nextStep', {
        firstStepFormData,
        currSelectType: state.formData.organizationType,
        organizationCode: state.formData.organizationCode,
        name: state.formData.name
      })
    } else {
      formRef.value!.scrollToField('companyCode')
    }
  })
}
getStateOptions()
!props.currEditId && setMapCenter(state.currLocation, 6)
if (!props.currEditId) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  state.formData.companyCode = props.companyCode
}
defineExpose({ state, nextSubmit, getOrgDetail })
</script>

<style lang="scss" scoped>
.my-form-box2 {
  .short-item {
    :deep(.el-form-item__content) {
      width: 130px;
    }
  }
  .address-item {
    :deep(.el-form-item__content) {
      width: 555px;
    }
  }
  .time-btn {
    margin-left: 10px;
    margin-top: 3px;
    .iconfont {
      font-size: 22px;
      cursor: pointer;
    }
  }
  .map-box {
    width: 520px;
    height: 520px;
    border: 1px dashed #ccc;
    margin-left: 90px;
  }
}
.flex-line {
  display: flex;
  :deep(.el-form-item) {
    flex: 1;
  }
}
</style>
