<!-- eslint-disable vue/no-mutating-props -->
<template>
  <dialog-component
    :dialog-visible="dialogVisible"
    :size="425"
    title="新增/编辑用户字段权限"
    @close-dialog="handleCancle"
    @save-dialog="saveDialog"
  >
    <div>
      <el-form ref="ruleFormRef" :model="editForm" :rules="rules" label-width="auto" class="my-form-box">
        <el-form-item label="账号:" prop="userCode">
          <el-input v-model="editForm.userCode" :disabled="!isAdd" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="应用:" prop="systemCodeDescr">
          <el-select
            v-model="editForm.systemCodeDescr"
            placeholder="请选择应用"
            :disabled="!isAdd"
            @change="selectApplication"
          >
            <el-option
              v-for="item in applicationList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字段名:" prop="fieldName">
          <el-input v-model="editForm.fieldName" placeholder="输入字段英文名" />
          <span class="message-text">多个字段请用逗号间隔</span>
        </el-form-item>
        <div v-if="!isAdd" class="form-date-box df aic">
          <el-form-item label="有效期:" prop="beginTime" required>
            <el-date-picker
              v-model="editForm.beginTime"
              :clearable="false"
              type="date"
              placeholder="开始日期"
              :disabled-date="disableDateFunc"
              @change="selectBeginTime"
            />
          </el-form-item>
          <div class="date-line">-</div>
          <el-form-item label-width="0px" prop="endTime">
            <el-date-picker
              v-model="editForm.endTime"
              :clearable="false"
              type="date"
              placeholder="结束日期"
              :disabled-date="disableEndDateFunc"
              @change="selectEndTime"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </dialog-component>
</template>

<script lang="ts" setup>
import { reactive, ref, PropType } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { formatDate } from '@/utils/index'
const props = defineProps({
  isAdd: {
    // 编辑框是否新增
    type: Boolean,
    default: false
  },
  dialogVisible: {
    // 编辑框是否显示
    type: Boolean,
    default: false
  },
  editForm: {
    // 详情
    type: Object,
    default: function () {
      return []
    }
  },
  applicationList: {
    // 应用列表
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const ruleFormRef = ref<FormInstance>()
// eslint-disable-next-line vue/no-mutating-props
// props.editForm.endTime = dayjs().add(50, 'year').format('YYYY-MM-DD')
// console.log('50年后的时间', dayjs().add(50, 'year').format('YYYY-MM-DD'))

const rules = reactive<FormRules>({
  userCode: [{ required: true, message: '请输入系统编码', trigger: 'blur' }],
  systemCodeDescr: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  roleName: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'change'
    }
  ],
  beginTime: [
    {
      type: 'date',
      required: true,
      message: '请选择开始日期',
      trigger: 'change'
    }
  ],
  endTime: [
    {
      type: 'date',
      required: true,
      message: '请选择结束日期',
      trigger: 'change'
    }
  ]
})

const emits = defineEmits(['cancelDialog', 'saveDialog', 'handleCancle', 'selectApplication'])

// 设置时间不可选项
const disableDateFunc = (time: Date) => {
  return props.editForm.currRoleId ? null : time.getTime() < Date.now() - 3600 * 1000 * 24
}

// 结束时间设置不可选项
const disableEndDateFunc = (time: Date) => {
  return time.getTime() < Date.parse(props.editForm.beginTime) + 3600 * 1000 * 24
}

// 保存
const saveDialog = async () => {
  await ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      emits('saveDialog', props.editForm)
    }
  })
}

const handleCancle = () => {
  emits('handleCancle')
}

// 选择开始时间
const selectBeginTime = (val: any) => {
  console.log('开始时间', formatDate(val, true))
  // eslint-disable-next-line vue/no-mutating-props
  props.editForm.beginTime = formatDate(val, true)
}

// 选择结束时间
const selectEndTime = (val: any) => {
  console.log('结束时间', val)
  // eslint-disable-next-line vue/no-mutating-props
  props.editForm.endTime = formatDate(val, true)
}

const selectApplication = (val: any) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.editForm.systemCode = val
}
</script>
<style lang="scss" scoped>
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
