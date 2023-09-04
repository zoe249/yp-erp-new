<template>
  <div class="top-title df aic jcsb">
    <div>维护组织关系</div>
    <el-button v-if="!currEditId" type="primary" class="top-button-box" @click="addItem('fst')">
      <i class="iconfont icon-tianjia1"></i>新增
    </el-button>
  </div>
  <table-page-content
    :table-data="state.tableFstList"
    :table-headers="tableStepFstHeader.filter((v) => !(currEditId && v.prop == 'operate'))"
    :table-height="220"
    :show-pager="false"
    :is-slot-num="false"
    :is-edit="true"
  >
    <template #organizationRelationTypeCode="{ row }">
      <el-select
        v-model="row.organizationRelationTypeCode"
        :disabled="currEditId ? true : false"
        @change="changeTypeHandle(row)"
      >
        <el-option
          v-for="item in state.orgRelationTypeOptions"
          :key="item.organizationRelationTypeCode"
          :label="`${item.organizationRelationTypeCode}-${item.name}`"
          :value="item.organizationRelationTypeCode"
        />
      </el-select>
    </template>
    <template #parentOrganizationCode="{ row }">
      <el-select v-model="row.parentOrganizationCode" :disabled="currEditId ? true : false">
        <template v-if="row.organizationRelationTypeCode === '01'">
          <el-option
            v-for="item in state.parentOrgFstOptions"
            :key="item.precinctCode"
            :label="`${item.precinctCode}-${item.name}`"
            :value="item.precinctCode"
          />
        </template>
        <template v-else>
          <el-option
            v-for="item in state.parentOrgOptions"
            :key="item.organizationCode"
            :label="`${item.organizationCode}-${item.name}`"
            :value="item.organizationCode"
          />
        </template>
      </el-select>
    </template>
    <template #beginTime="{ row }">
      <el-date-picker
        v-model="row.beginTime"
        :disabled="currEditId ? true : false"
        type="date"
        placeholder="开始有效期"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        :clearable="false"
      />
    </template>
    <template #endTime="{ row }">
      <el-date-picker
        v-model="row.endTime"
        :disabled="currEditId ? true : false"
        type="date"
        placeholder="结束有效期"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        :clearable="false"
      />
    </template>
    <template #operate="{ $index }">
      <div class="table-btn-box">
        <el-button link @click="delItem('fst', $index)"
          ><i class="iconfont icon-tubiaozhizuomoban"></i><span class="text">删除</span></el-button
        >
      </div>
    </template>
  </table-page-content>
  <template v-if="currSelectType === '03'">
    <div class="top-title df aic jcsb" style="margin-top: 40px">
      <div>维护库存信息</div>
      <el-button v-if="!currEditId" type="primary" class="top-button-box" @click="addItem('lst')">
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
    </div>
    <table-page-content
      :table-data="state.tableLastList"
      :table-headers="tableStepLastHeader.filter((v) => !(currEditId && v.prop == 'operate'))"
      :table-height="220"
      :show-pager="false"
      :is-slot-num="false"
      :is-edit="true"
    >
      <template #type="{ row, $index }">
        <el-select
          v-model="row.type"
          :disabled="$index === 0 || (currEditId ? true : false)"
          placeholder="请选择库区类型"
          clearable
        >
          <el-option
            v-for="item in state.areaOptions"
            :key="item.code"
            :label="`${item.code}-${item.name}`"
            :value="item.code"
          />
        </el-select>
      </template>
      <template #storageAreaCode="{ row, $index }">
        <el-input
          v-model="row.storageAreaCode"
          :disabled="$index === 0 || (currEditId ? true : false)"
          placeholder="请填写库区编码"
        ></el-input>
      </template>
      <template #name="{ row }">
        <el-input v-model="row.name" :disabled="currEditId ? true : false" placeholder="库区名称"></el-input>
      </template>
      <template #operate="{ $index }">
        <div class="table-btn-box">
          <el-button
            link
            :disabled="$index == 0"
            :style="{ color: $index == 0 ? '#99BAFA !important' : '#558DF7' }"
            @click="delItem('lst', $index)"
            ><i class="iconfont icon-tubiaozhizuomoban"></i><span class="text">删除</span></el-button
          >
        </div>
      </template>
    </table-page-content>
  </template>
</template>

<script setup lang="ts">
import { tableStepFstHeader, tableStepLastHeader } from '../config'
import { getAreaList } from '@/views/orgManagement/orgArea/api'
import { getOrgData } from '../api'
import { DicsObj, getDicsList } from '@/hooks/dicsData'
import { formatDate, spliceCodeName } from '@/utils/index'
import { useProxy } from '@/utils/proxy'
import { orgTypeList } from '@/views/orgManagement/orgRelationTypeManage/api'
const props = defineProps({
  currSelectType: {
    type: String,
    default: ''
  },
  currEditId: {
    type: String,
    default: ''
  },
  organizationCode: {
    type: String,
    default: ''
  },
  orgName: {
    type: String,
    default: ''
  },
  companyCode: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['submit'])
const { proxy } = useProxy()
const state = reactive({
  tableFstList: [] as any,
  tableLastList: [] as any,
  orgRelationTypeOptions: [] as any,
  parentOrgOptions: [] as any,
  parentOrgFstOptions: [] as any,
  areaOptions: [] as TsearchItem[]
})
const nowDate = new Date()
//新增项
const addItem = (type: 'fst' | 'lst') => {
  if (type === 'fst') {
    state.tableFstList.push({
      organizationRelationTypeCode: '',
      parentOrganizationCode: '',
      organizationCode: props.organizationCode,
      beginTime: formatDate(nowDate, true),
      endTime: formatDate(new Date(nowDate.setFullYear(nowDate.getFullYear() + 50)), true),
      status: true
    })
  } else {
    state.tableLastList.push({
      type: '',
      storageAreaCode: '',
      name: '',
      status: true,
      organizationCode: props.organizationCode
    })
  }
}
// 删除项
const delItem = (type: 'fst' | 'lst', index: number) => {
  if (type === 'fst') {
    state.tableFstList.splice(index, 1)
  } else {
    state.tableLastList.splice(index, 1)
  }
}
// 筛选组织关系类型， 获取相应的父级区域信息
const changeTypeHandle = async (row: any) => {
  const e = row.organizationRelationTypeCode
  row.parentOrganizationCode = ''
  let data = null
  switch (e) {
    case '01':
      // 父级组织只能是管理区域，组织列表中显示《组织信息》中组织类型为门店的记录
      data = await getAreaList({ companyCode: props.companyCode, pageIndex: 1, pageSize: 9999 })
      state.parentOrgFstOptions = data.data
      break
    case '02':
      // 组织关系添加时，父级组织显示《组织信息》中组织类型为分公司的记录，组织列表中显示《组织信息》中组织类型为门店的记录
      data = await getOrgData({
        organizationType: '02',
        companyCode: props.companyCode,
        pageIndex: 1,
        pageSize: 9999
      })
      state.parentOrgOptions = data.data
      break
    case '03':
      // 组织关系添加时，父级组织显示《组织信息》中组织类型为行政部门的记录，组织列表中显示《店铺信息》
      data = await getOrgData({
        organizationType: '05',
        companyCode: props.companyCode,
        pageIndex: 1,
        pageSize: 9999
      })
      state.parentOrgOptions = data.data
      break
    case '04':
      data = await getOrgData({
        organizationType: '04',
        companyCode: props.companyCode,
        pageIndex: 1,
        pageSize: 9999
      })
      state.parentOrgOptions = data.data
      break
    default:
      data = await getOrgData({ companyCode: props.companyCode, pageIndex: 1, pageSize: 9999 })
      state.parentOrgOptions = data.data
      break
  }
}
// 获取详情
const getOrgDetail = (data: any) => {
  if (!data) return
  const { organizationRelationList, storageAreaList } = data
  organizationRelationList?.length > 0 &&
    organizationRelationList.forEach((item: any) => {
      item.beginTime = formatDate(item.beginTime, true)
      item.endTime = formatDate(item.endTime, true)
      item.parentOrganizationCode = spliceCodeName(
        item.parentOrganizationCode,
        item.parentOrganizationCodeDescr
      )
    })
  state.tableFstList = organizationRelationList || []
  state.tableLastList = storageAreaList || []
}
watch(
  () => props.currSelectType,
  () => {
    if (props.currSelectType === '03') {
      const storageAreaList = [
        {
          organizationCode: props.organizationCode, //门店编码
          type: '01', //库区类型
          storageAreaCode: `${props.organizationCode}01`, //库区编码
          name: props.orgName, // 库区名称
          status: true
        }
      ]
      state.tableLastList = storageAreaList
    }
  }
)
const handleSubmit = () => {
  if (props.currEditId) {
    emit('submit')
  } else {
    let noValid = false
    x: for (let i = 0; i < state.tableFstList.length; i++) {
      for (let key in state.tableFstList[i]) {
        if (key == 'organizationCode' || key == 'status') continue
        if (!state.tableFstList[i][key]) {
          proxy.$message.msgError(`组织关系第${i + 1}行校验错误,字段不能为空`)
          noValid = true
          break x
        }
        if (
          key == 'beginTime' &&
          new Date(state.tableFstList[i][key]) > new Date(state.tableFstList[i]['endTime'])
        ) {
          proxy.$message.msgError(`组织关系第${i + 1}行校验错误,开始时间不能大于结束时间`)
          noValid = true
          break x
        }
      }
    }
    if (props.currSelectType == '03') {
      y: for (let i = 0; i < state.tableLastList.length; i++) {
        for (let key in state.tableLastList[i]) {
          if (key == 'organizationCode' || key == 'status') continue
          if (!state.tableLastList[i][key]) {
            proxy.$message.msgError(`库存信息第${i + 1}行校验错误,字段不能为空`)
            noValid = true
            break y
          }
          if (key == 'storageAreaCode' && !/^[0-9a-zA-Z]*$/.test(state.tableLastList[i][key])) {
            proxy.$message.msgError(`库存信息第${i + 1}行校验错误,编码只能是数字或字母`)
            noValid = true
            break y
          }
        }
      }
    }
    if (noValid) return
    const params = {
      organizationRelationList: state.tableFstList,
      storageAreaList: state.tableLastList
    }
    emit('submit', params)
  }
}
defineExpose({ state, getOrgDetail, handleSubmit })
// 初始化
const init = () => {
  orgTypeList({ companyCode: props.companyCode }).then((res) => {
    state.orgRelationTypeOptions = res.data || []
  })
  getDicsList(DicsObj.H002).then((res: any) => {
    state.areaOptions = res || []
  })
}
init()
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__suffix) {
  display: none;
}
:deep(.el-input__prefix) {
  display: none;
}
:deep(.el-input) {
  width: 100% !important;
}
:deep(.el-input__inner) {
  font-size: 14px;
  text-align: center;
}
:deep(.el-table) {
  .cell {
    padding: 0px 6px !important;
  }
}
:deep(.is-disabled) {
  .el-input__wrapper {
    background-color: #fff !important;
    box-shadow: none;
  }
  .el-input__inner {
    -webkit-text-fill-color: #333333 !important;
  }
}
:deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
}
:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}
.top-title {
  font-size: 20px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 18px;
}
</style>
