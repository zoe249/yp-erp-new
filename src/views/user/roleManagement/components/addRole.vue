<template>
  <draw-component
    :drawer-visible="state.show"
    size="57%"
    title="新增/编辑角色"
    @close-drawer="handleClose"
    @save-drawer="handleSubmit"
  >
    <el-form
      ref="formRef"
      :model="state.formData"
      :rules="state.formRules"
      label-width="90px"
      class="my-form-box"
    >
      <div class="flex-line">
        <div class="flex-line-left">
          <el-form-item label="应用:" prop="systemCode">
            <el-select
              v-model="state.formData.systemCode"
              placeholder="请选择应用"
              :disabled="state.currRoleId ? true : false"
              @change="handleSystemChange"
            >
              <el-option
                v-for="item in state.systemOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色类型:" prop="type">
            <el-select v-model="state.formData.type" placeholder="请选择角色类型">
              <el-option
                v-for="item in roleTypeOptions"
                :key="item.code"
                :label="`${item.code}-${item.name}`"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称:" prop="name">
            <el-input
              v-model="state.formData.name"
              placeholder="请输入角色名称"
              :disabled="state.currRoleId ? true : false"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input v-model="state.formData.description" placeholder="描述"></el-input>
          </el-form-item>

          <div class="form-date-box df aic">
            <el-form-item label="有效期:" prop="beginTime">
              <el-date-picker
                v-model="state.formData.beginTime"
                type="date"
                :disabled-date="disableDateFunc"
                placeholder="开始有效期"
                :clearable="false"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <div class="date-line">-</div>
            <el-form-item prop="endTime" label-width="0px">
              <el-date-picker
                v-model="state.formData.endTime"
                type="date"
                :clearable="false"
                :disabled-date="disableEndDateFunc"
                placeholder="结束有效期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
        </div>
        <el-form-item label="功能权限:" prop="permissionIds" class="flex-line-right">
          <!-- <el-input v-model="filterText" placeholder="输入关键词快速查找" style="width:300px"/> -->
          <el-tree
            ref="treeRef"
            class="permission-tree"
            :data="state.permissionOptions"
            :props="state.props"
            default-expand-all
            :check-strictly="false"
            show-checkbox
            node-key="id"
          />
        </el-form-item>
      </div>
    </el-form>
  </draw-component>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { menuList } from '@/views/user/menu/api'
import { editSubmit, addSubmit, validateNameExist, getRoleDetailById } from '../api'
import useTabStore from '@/store/modules/scrollTab'
import { PropType } from 'vue'
import { useProxy } from '@/utils/proxy'
import { formatDate } from '@/utils/index'
const validateTime = async (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
  } else if (new Date(value) > new Date(state.formData.endTime)) {
    callback(new Error('结束时间不能早于开始时间'))
  } else {
    callback()
  }
}
const validateName = async (rule: any, value: any, callback: any) => {
  if (!state.formData.systemCode || state.currRoleId) {
    return callback()
  }
  const { data } = await validateNameExist<boolean>({
    name: state.formData.name,
    id: state.currRoleId || null,
    systemCode: state.formData.systemCode
  })
  if (data) {
    callback(new Error('角色名称重复'))
  } else {
    callback()
  }
}
const props = defineProps({
  roleTypeOptions: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  }
})
const emit = defineEmits(['handleAdded'])
const { proxy } = useProxy()
const tabStore = useTabStore()
const formRef = ref<FormInstance>()
const treeRef = ref()
const state = reactive({
  currRoleId: '',
  show: false,
  isSubmiting: false,
  formData: {
    systemCode: '',
    permissionIds: [],
    beginTime: '',
    endTime: '',
    type: '',
    name: '',
    description: ''
  },
  formRules: {
    systemCode: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
    type: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { max: 64, message: '输入字符不得超过64位', trigger: 'blur' },
      { validator: validateName, trigger: 'blur' }
    ],
    beginTime: [
      { required: true, message: '请选择时间', trigger: 'blur' },
      { validator: validateTime, trigger: 'blur' }
    ],
    endTime: [{ required: true, message: '请选择时间', trigger: 'blur' }]
  } as FormRules,
  permissionOptions: [],
  systemOptions: computed(() => tabStore.systemList),
  props: {
    label: 'name',
    children: 'permissions'
  }
})
// 关闭回调
const handleClose = () => {
  state.currRoleId = ''
  state.formData = {
    systemCode: '',
    permissionIds: [],
    beginTime: '',
    endTime: '',
    type: '',
    name: '',
    description: ''
  }
  state.show = false
}
// 保存
const handleSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const selectFuncAry = treeRef.value.getCheckedKeys()
      const selectHalfAry = treeRef.value.getHalfCheckedKeys()
      const permissionIds = selectFuncAry.concat(selectHalfAry)
      const params = { ...state.formData }
      params.permissionIds = permissionIds
      state.isSubmiting = true
      if (state.currRoleId) {
        editSubmit(state.currRoleId, params)
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
        addSubmit(params)
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
// 应用选择回调
const handleSystemChange = (val: string) => {
  getPermissionList()
}
// 获取权限树
const getPermissionList = async () => {
  let { data } = await menuList<any>({
    checkButton: true,
    systemCode: state.formData.systemCode
  })
  state.permissionOptions = data || []
}
// 设置时间不可选项
const disableDateFunc = (time: Date) => {
  return state.currRoleId ? null : time.getTime() < Date.now() - 3600 * 1000 * 24
}

const disableEndDateFunc = (time: Date) => {
  return time.getTime() < Date.parse(state.formData.beginTime) - 3600 * 1000 * 24
}
// 获取详情
const getRoleDetail = async () => {
  let { data } = await getRoleDetailById<any>(state.currRoleId)
  const form = {} as any
  Object.keys(state.formData).forEach((item, index) => {
    if (item == 'beginTime') {
      form[item] = formatDate(data.beginTime, true)
    } else if (item == 'endTime') {
      form[item] = formatDate(data.endTime, true)
    } else if (item == 'permissionIds') {
      form[item] = data.permissionList.length > 0 ? data.permissionList.map((v: any) => v.permissionId) : []
    } else {
      form[item] = data[item] ?? ''
    }
  })
  state.formData = form
  await getPermissionList()
  if (data.permissionList) {
    nextTick(() => {
      for (const key of data.permissionList) {
        const node = treeRef.value.getNode(key.permissionId)
        if (node.isLeaf) {
          treeRef.value.setChecked(node, true)
        }
      }
    })
  }
}
defineExpose({ state, getRoleDetail })
</script>

<style lang="scss" scoped>
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
.permission-tree {
  height: 400px;
}
.form-date-box {
  :deep(.el-form-item__content) {
    width: 128px;
  }
  :deep(.el-input__wrapper) {
    padding-right: 9px;
  }
  :deep(.el-form-item:last-child .el-form-item__label::before) {
    display: none;
  }
}
</style>
