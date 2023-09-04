<!-- eslint-disable vue/no-mutating-props -->
<template>
  <dialog-component
    :dialog-visible="dialogVisible"
    :size="390"
    title="菜单-编辑"
    @close-dialog="handleCancle"
    @save-dialog="saveDialog"
  >
    <el-form ref="ruleFormRef" :model="editForm" :rules="rules" label-width="100px" class="my-form-box2">
      <el-form-item label="父级目录:">
        <div>{{ editForm.parentDescr }}</div>
      </el-form-item>
      <el-form-item label="菜单名称:" prop="code">
        <el-input v-model="editForm.name" :disabled="editState" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="请求URL:" prop="name">
        <el-input v-model="editForm.url" :disabled="editState" placeholder="请输入请求地址" />
      </el-form-item>
      <el-form-item label="序号:" prop="desc">
        <el-input v-model="editForm.displayOrder" />
      </el-form-item>
      <el-form-item label="图标:">
        <img-upload
          :is-show-tip="false"
          :is-avatar="true"
          :show-file-list="false"
          :avatar-url="editForm.logo"
          @handle-success="uploadSuccess"
        >
          <slot>
            <el-button>上传图标</el-button>
          </slot>
        </img-upload>
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input v-model="editForm.description" />
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="editForm.type" :disabled="editState">
          <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </dialog-component>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
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
  }
})

const ruleFormRef = ref<FormInstance>()
const editState = ref(true)

const list = [
  {
    value: '1',
    label: '应用'
  },
  {
    value: '2',
    label: '菜单'
  },
  {
    value: '3',
    label: '按钮'
  }
]
const rules = reactive<FormRules>({
  code: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入请求URL', trigger: 'blur' }]
})

const emits = defineEmits(['cancelDialog', 'saveDialog', 'handleCancle'])

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

//上传图片成功
const uploadSuccess = (imgUrl: string) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.editForm.logo = imgUrl
}
</script>
<style lang="scss" scoped></style>
