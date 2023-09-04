<template>
  <draw-component
    :drawer-visible="drawerVisible"
    :title="title"
    @close-drawer="emits('closeDrawer')"
    @save-drawer="saveDrawer(formRef)"
  >
    <div class="drawer-content-title">基本信息</div>
    <el-form ref="formRef" :model="state.formData" :rules="state.rules" class="my-form-box2">
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item label="企业:" prop="companyCode">
            <el-select v-model="state.formData.companyCode" disabled="true">
              <el-option
                v-for="item in companyOptions"
                :key="item.companyCode"
                :label="`${item.companyCode}-${item.companyName}`"
                :value="item.companyCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="state.colSpan">
          <el-form-item label="店铺类型:" prop="type">
            <el-select
              v-model="state.formData.type"
              :disabled="(!userInfo.headQuartersFlag && id === '') || id !== ''"
              @change="getStores"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item
            v-if="!userInfo.headQuartersFlag || (userInfo.headQuartersFlag && id)"
            label="&nbsp;&nbsp;门店:"
            prop="organizationCode"
          >
            <el-input v-model="state.organizationCodeWithDescr" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="state.colSpan"></el-col>
      </el-row>
      <el-row :gutter="state.gutter">
        <el-col :span="state.colSpan">
          <el-form-item label="店铺:" prop="storeCode">
            <el-select v-model="state.formData.storeCode" :disabled="id !== ''">
              <el-option
                v-for="item in state.storeCodeOptions"
                :key="item.storeCode"
                :label="`${item.storeCode}-${item.name}`"
                :value="item.storeCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="state.colSpan">
          <el-form-item label="有效状态:" prop="status">
            <el-switch v-model="state.formData.status"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="经营时间类型:" prop="durationType">
        <el-radio-group v-model="state.formData.durationType" style="width: 250px; flex-wrap: nowrap">
          <el-radio v-for="(item, index) in state.durationTypeOptions" :key="index" :label="item.code">{{
            item.name
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div v-show="state.formData.durationType !== '01'" class="drawer-content-title">营业时间设置</div>
    <duration-set
      ref="durationRef"
      :duration-type="state.formData.durationType"
      @emit-every-day="emitEveryDay"
      @emit-every-week="emitEveryWeek"
    ></duration-set>
    <transfer-table
      v-if="userInfo.headQuartersFlag && !id"
      ref="transferRef"
      :table-height="state.transferTableHeight"
      :company-code="state.formData.companyCode"
      @emits-org-codes="emitsOrgCodes"
    ></transfer-table>
  </draw-component>
</template>

<script lang="ts" setup name="AddForm">
import DurationSet from './durationSet.vue'
import TransferTable from './transferTable.vue'
import { getDicsList } from '@/hooks/dicsData'
import { PropType } from 'vue'
import { getList } from '@/views/orgManagement/storeInfo/api'
import type { FormInstance } from 'element-plus'
import { useProxy } from '@/utils/proxy'
import { addSubmit, editSubmit, getDetail } from '../api'
import useScrollStore from '@/store/modules/scrollTab'
import { filterData, handleRepeatTime } from '@/utils'
const { proxy } = useProxy()
interface Iuser {
  headQuartersFlag: boolean
  organizationCode: string
  organizationDescr: string
  organizationType: string
  [propName: string]: any
}
interface Iform {
  [propName: string]: any
}
const formRef = ref<any>()
const durationRef = ref<any>()
const transferRef = ref<any>()
const companyOptions = useScrollStore().companyList
const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  typeOptions: {
    type: Array,
    default: () => {
      return [] as any
    }
  },
  userInfo: {
    type: Object as PropType<Iuser>,
    default: () => {
      return {}
    }
  }
})
const state = reactive({
  organizationCodeWithDescr: '', // 门店编码 接收数据展示用
  formData: {
    companyCode: '',
    storeCode: null,
    type: null,
    status: true, // 默认true有效
    durationType: '01', // 默认01全天
    organizationCodes: [] as any // 门店编码 提交传参用
  } as Iform,
  rules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'change' }],
    type: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
    storeCode: [{ required: true, message: '请选择店铺', trigger: 'change' }],
    durationType: [{ required: true, message: '请选择经营时间类型', trigger: 'change' }]
  },
  storeCodeOptions: [] as any,
  colSpan: 9,
  gutter: 30,
  durationTypeOptions: [] as any,
  transferTableHeight: 250
})

const emits = defineEmits(['closeDrawer', 'refreshList'])
const validTime = (): any => {
  const _durationType = state.formData.durationType
  const _state = durationRef.value.state // ref获取子组件的属性
  // 保存时 校验时间和周不能为空
  if (_durationType === '02') {
    if (!handleRepeatTime(_state.everyDays)) {
      proxy.$message.msgWarning('时间段不能重叠或重复，请重新选择！')
      return false
    }
    for (let i = 0; i < _state.everyDays.length; i++) {
      let values1 = Object.values(_state.everyDays[i])
      if (values1.includes(null)) {
        proxy.$message.msgWarning('时间不能为空！')
        return false
      }
    }
    return true
  }
  if (_durationType === '03') {
    for (let i = 0; i < _state.everyWeek.length; i++) {
      for (let j = 0; j < _state.everyWeek[i].times.length; j++) {
        if (!handleRepeatTime(_state.everyWeek[i].times)) {
          proxy.$message.msgWarning('时间段不能重叠或重复，请重新选择！')
          return false
        }
        let values = Object.values(_state.everyWeek[i].times[j])
        let checkList = _state.everyWeek[i].checkList
        if (values.includes(null) || !checkList.length) {
          proxy.$message.msgWarning('时间和周不能为空！')
          return false
        }
      }
    }
    return true
  }
}
const saveDrawer = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      if (state.formData.durationType !== '01') {
        let _valide = validTime()
        // 营业时间类型 为02和03时调用，校验通过调用
        if (!_valide) return
        durationRef.value.emitsTimeData()
      }
      // 总部人员调用
      if (props.userInfo.headQuartersFlag) {
        // 无id表示新增，新增要处理orgCodes，编辑时不处理orgCodes组织编码
        if (!props.id) {
          let flag = transferRef.value.emitsOrgCodes()
          if (!flag) return
        }
      }
      const defaultTime = '00:00-00:00'
      const commonParam = {
        companyCode: state.formData.companyCode,
        storeCode: state.formData.storeCode,
        type: state.formData.type,
        status: state.formData.status,
        durationType: state.formData.durationType,
        organizationCodes: state.formData.organizationCodes
      }
      const duraType02Param = {
        everyDay: state.formData.everyDay || defaultTime
      }
      const duraType03Param = {
        mon: state.formData.mon || defaultTime,
        tue: state.formData.tue || defaultTime,
        wed: state.formData.wed || defaultTime,
        thu: state.formData.thu || defaultTime,
        fri: state.formData.fri || defaultTime,
        sat: state.formData.sat || defaultTime,
        sun: state.formData.sun || defaultTime
      }
      if (props.id) {
        // 有id则表示编辑保存
        let editParam = {} as any
        if (state.formData.durationType === '01') {
          editParam = {
            status: commonParam.status,
            durationType: commonParam.durationType
          }
        }
        if (state.formData.durationType === '02') {
          editParam = {
            status: commonParam.status,
            durationType: commonParam.durationType,
            everyDay: duraType02Param.everyDay
          }
        }
        if (state.formData.durationType === '03') {
          editParam = {
            status: commonParam.status,
            durationType: commonParam.durationType,
            ...duraType03Param
          }
        }
        editSubmit(props.id, editParam).then((res: any) => {
          proxy.$message.msgSuccess('修改成功！')
          emits('closeDrawer')
          emits('refreshList')
        })
      } else {
        // 反之新增保存
        let addParam = {} as any
        if (state.formData.durationType === '01') {
          addParam = {
            ...commonParam
          }
        }
        if (state.formData.durationType === '02') {
          addParam = {
            ...commonParam,
            everyDay: duraType02Param.everyDay
          }
        }
        if (state.formData.durationType === '03') {
          addParam = {
            ...commonParam,
            ...duraType03Param
          }
        }
        addSubmit(addParam).then((res: any) => {
          proxy.$message.msgSuccess('保存成功！')
          emits('closeDrawer')
          emits('refreshList')
        })
      }
    }
  })
}
const emitEveryDay = (str: string) => {
  state.formData.everyDay = str
}
const emitEveryWeek = (obj: any) => {
  state.formData = Object.assign(state.formData, obj)
}
const emitsOrgCodes = (val: any) => {
  state.formData.organizationCodes = val
}
// 获取有效店铺
const getStores = () => {
  if (!state.formData.companyCode) {
    return proxy.$message.msgWarning('请先选择企业')
  }
  state.storeCodeOptions = []
  state.formData.storeCode = ''
  getList<any>({
    status: true,
    type: state.formData.type,
    companyCode: state.formData.companyCode,
    pageIndex: 1,
    pageSize: 9999
  }).then((res) => {
    state.storeCodeOptions = res.data
  })
}
const getDetailById = () => {
  getDetail(props.id).then((res: any) => {
    let data: any = res.data
    state.formData.storeCode = data.storeCode
    state.formData.type = data.type
    state.formData.status = data.status
    state.formData.durationType = data.durationType
    state.organizationCodeWithDescr = data.organizationCodeDescr
      ? data.organizationCode + '-' + data.organizationCodeDescr
      : data.organizationCode
    state.formData.organizationCodes = [data.organizationCode]
    if (data.durationType === '02') {
      let resTime = reHandleTime(data.everyDay)
      nextTick(() => {
        durationRef.value.state.everyDays = resTime
      })
    }
    if (data.durationType === '03') {
      let _resWeekTime = reHandleWeek(data)
      nextTick(() => {
        durationRef.value.state.everyWeek = _resWeekTime
      })
    }
  })
}
// 组合time数据, 把字符串组合成数组对象的形式 每天重复02的情况
// '01:00-02:00;12:20-13:20' 转化为 [{startTime:'01:00', endTime: '02:00'},{startTime:'12:20', endTime: '13:20'}]
const reHandleTime = (str: string) => {
  const timeArr = str.split(';')
  let finalTimeArr = [] as any
  timeArr.forEach((item: any) => {
    let itArr = item.split('-')
    let obj = {
      startTime: itArr[0],
      endTime: itArr[1]
    }
    finalTimeArr.push(obj)
  })
  return finalTimeArr
}
// 处理详情里的时间格式为组件需要的格式 每周重复03的情况
const reHandleWeek = (data: any): any => {
  let resWeekTime = [] as any
  let changeList = [] as any
  let weekObj = {
    mon: data.mon,
    tue: data.tue,
    wed: data.wed,
    thu: data.thu,
    fri: data.fri,
    sat: data.sat,
    sun: data.sun
  } as any
  for (let i in weekObj) {
    // 时间
    let keyTime = weekObj[i]
    // 周几
    let valueWeek = i
    //和过去做对比(从过去取是这个key的数据),不要和默认时间相等的数据
    if (!changeList.length) {
      let obj = {} as any
      obj[keyTime] = [valueWeek]
      changeList.push(obj)
    } else {
      // 后面的存放周几的数组
      filterData(changeList, keyTime, valueWeek)
    }
  }
  if (!changeList.length) return
  changeList.forEach((item: any, index: number) => {
    let week = [
      {
        label: '周一',
        value: 'mon',
        disabled: false
      },
      {
        label: '周二',
        value: 'tue',
        disabled: false
      },
      {
        label: '周三',
        value: 'wed',
        disabled: false
      },
      {
        label: '周四',
        value: 'thu',
        disabled: false
      },
      {
        label: '周五',
        value: 'fri',
        disabled: false
      },
      {
        label: '周六',
        value: 'sat',
        disabled: false
      },
      {
        label: '周日',
        value: 'sun',
        disabled: false
      }
    ]
    let _obj = {
      weeks: week,
      checkList: [],
      times: []
    }
    for (let j in item) {
      let timesArr = j.split(';')
      timesArr = timesArr.filter((el: any) => {
        return el !== ''
      })
      // 重组UI组件需要的时间数组
      if (timesArr.length) {
        timesArr.forEach((it) => {
          let arr = it.split('-')
          // @ts-ignore
          _obj.times.push({ startTime: arr[0], endTime: arr[1] })
        })
      }
      // 重组checkbox选中的week数组
      _obj.checkList = item[j]
      resWeekTime.push(_obj)
    }
    resWeekTime.forEach((el: any, i: number) => {
      if (i !== resWeekTime.length - 1) {
        el.weeks.forEach((ite: any) => {
          ite.disabled = true
        })
      }
    })
  })
  return resWeekTime
}
const getTableHeight = () => {
  nextTick(() => {
    const documentHeight = document.body.clientHeight
    const formHeight = formRef.value.$el.clientHeight
    const timeWrapHeight = durationRef.value.$el.clientHeight
    const otherHeight = 360
    state.transferTableHeight = documentHeight - formHeight - timeWrapHeight - otherHeight
  })
}
window.onresize = () => {
  getTableHeight()
}
const init = async () => {
  getTableHeight()
  // 门店人员 门店编码自动带出，门店类型默认02门店特有
  if (!props.userInfo.headQuartersFlag) {
    let userInfo = props.userInfo
    let organizationCode = userInfo.organizationCode
    let organizationDescr = userInfo.organizationDescr
    state.formData.type = '02'
    state.formData.organizationCodes = [organizationCode]
    state.organizationCodeWithDescr = organizationDescr
      ? organizationCode + '-' + organizationDescr
      : organizationCode
  }
  // 获取营业状态选项
  getDicsList('H004').then((res: any) => {
    state.durationTypeOptions = res as Array<any>
  })
}
init()
defineExpose({
  state
})
watch(
  () => state.formData.durationType,
  (val) => {
    if (val === '01') {
      state.formData.everyDay = null
      state.formData.mon = null
      state.formData.tue = null
      state.formData.wed = null
      state.formData.thu = null
      state.formData.fri = null
      state.formData.sat = null
      state.formData.sun = null
    }
    if (val === '02') {
      state.formData.mon = null
      state.formData.tue = null
      state.formData.wed = null
      state.formData.thu = null
      state.formData.fri = null
      state.formData.sat = null
      state.formData.sun = null
    }
    if (val === '03') {
      state.formData.everyDay = null
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => state.formData.companyCode,
  (val) => {
    if (val) {
      state.formData.storeCode = ''
      getStores()
    }
  },
  { immediate: true }
)
watch(
  () => props.id,
  (val) => {
    if (val) {
      getDetailById()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.drawer-content-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20px;
}
</style>
