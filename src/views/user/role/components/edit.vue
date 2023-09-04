<!-- eslint-disable vue/no-mutating-props -->
<template>
  <dialog-component
    :dialog-visible="dialogVisible"
    :size="425"
    :title="title"
    @close-dialog="handleCancle"
    @save-dialog="saveDialog"
  >
    <el-form ref="ruleFormRef" :model="editForm" :rules="rules" label-width="auto" class="my-form-box">
      <el-form-item label="账号:" prop="userCode">
        <el-input v-model="editForm.userCode" :disabled="!isAdd" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="应用:" prop="systemCodeDescr">
        <el-select
          v-model="editForm.systemCodeDescr"
          :disabled="!isAdd"
          placeholder="请选择应用"
          @change="selectApplication"
        >
          <el-option v-for="item in applicationList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色:" prop="roleName">
        <el-select
          v-model="editForm.roleName"
          multiple
          placeholder="请选择角色"
          :disabled="!isAdd"
          @change="selectRole"
        >
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <div v-if="!isAdd" class="form-date-box df aic">
        <el-form-item label="有效期:" prop="beginTime" required>
          <el-date-picker
            v-model="editForm.beginTime"
            :clearable="false"
            type="date"
            placeholder="开始日期"
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
            @change="selectEndTime"
          />
        </el-form-item>
      </div>
    </el-form>
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
  },
  roleList: {
    // 角色列表
    type: Array as PropType<any[]>,
    default: () => []
  },
  title: {
    // 编辑框标题
    type: String,
    default: '新增用户角色对应关系'
  }
})

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  userCode: [{ required: true, message: '请输入系统编码', trigger: 'blur' }],
  systemCodeDescr: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  roleName: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'blur'
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

const emits = defineEmits(['cancelDialog', 'saveDialog', 'handleCancle', 'selectApplication', 'selectRole'])

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

// 选择应用
const selectApplication = (val: any) => {
  console.log('选择应用', val)
  emits('selectApplication', val)
}

// 选择角色
const selectRole = (val: any) => {
  console.log('选择角色', val)
  emits('selectRole', val)
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
