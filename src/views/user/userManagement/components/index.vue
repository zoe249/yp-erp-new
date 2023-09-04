<template>
  <draw-component
    :drawer-visible="state.show"
    :size="500"
    title="基本信息"
    @close-drawer="handleClose"
    @save-drawer="handleSubmit"
  >
    <el-form
      ref="formRef"
      class="my-form-box2"
      :model="state.formData"
      label-width="100px"
      label-position="right"
      size="default"
      :rules="state.rules"
    >
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
      <el-form-item label="账号:" prop="code">
        <el-input
          v-model="state.formData.code"
          type="text"
          placeholder="请输入登录账号"
          :disabled="state.userId ? true : false"
        />
      </el-form-item>
      <el-form-item v-show="false" label="密码:" prop="password">
        <el-input
          v-model="state.formData.password"
          type="password"
          placeholder="阻止浏览器默认填充密码的行为"
          autocomplete="new-password"
        />
      </el-form-item>
      <!-- 查看详情时，密码属性不显示 -->
      <el-form-item v-if="!state.userId" label="密码:" prop="password">
        <el-input v-model="state.formData.password" type="password" placeholder="请输入登录密码" />
        <span v-if="state.formData.password.length == 0" class="password-input">
          请输入密码,不输入则默认为初始密码
        </span>
      </el-form-item>
      <el-form-item label="用户类型:" prop="userType">
        <el-select v-model="state.formData.userType" placeholder="请选择用户类型">
          <el-option
            v-for="item in userTypeDics"
            :key="item.code"
            :label="`${item.code} - ${item.name}`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="真实姓名:" prop="realName">
        <el-input v-model="state.formData.realName" type="text" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="性别:" prop="gender">
        <el-select v-model="state.formData.gender" placeholder="请选择性别">
          <el-option
            v-for="item in sexDics"
            :key="item.code"
            :label="`${item.code} - ${item.name}`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式:" prop="phone">
        <el-input v-model="state.formData.phone" type="text" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="state.formData.email" type="text" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="头像:" prop="avatar">
        <img-upload
          :is-show-tip="false"
          :is-avatar="true"
          :show-file-list="false"
          :avatar-url="state.formData.avatar"
          @handle-success="uploadSuccess"
        ></img-upload>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio-group
          v-model="state.formData.status"
          :disabled="(state.userId ? true : false) && state.formData.status == '02'"
        >
          <el-radio label="01">有效</el-radio>
          <el-radio label="02">无效</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="header-title">
        <span class="left-title df aic"> <i class="left-icon"></i>员工信息</span>
      </div>
      <el-form-item
        label="组织类型:"
        prop="organizationType"
        :rules="
          state.formData.userType == '0'
            ? [{ required: true, message: '请选择组织类型', trigger: 'blur' }]
            : []
        "
      >
        <el-select
          v-model="state.formData.organizationType"
          placeholder="请选择组织类型"
          @change="selectOrgType"
        >
          <el-option
            v-for="item in orgDics"
            :key="item.code"
            :label="`${item.code} - ${item.name}`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属组织:"
        prop="organizationCode"
        :rules="
          state.formData.userType == '0'
            ? [{ required: true, message: '请选择所属组织', trigger: 'blur' }]
            : []
        "
      >
        <el-input
          v-model="state.formData.organization"
          type="text"
          placeholder="请选择所属组织"
          :disabled="state.formData.organizationType ? false : true"
          @click="selectOrg"
        />
      </el-form-item>
      <el-form-item label="上级负责人:" prop="superior">
        <div class="df">
          <el-input
            v-model="state.formData.superior"
            type="text"
            placeholder="请输入上级负责人账号"
            style="width: 180px"
            @input="superiorChange"
          />
          <span class="date-line" style="color: #ccc; margin-bottom: 0px">-</span>
          <el-input
            v-model="state.formData.superiorDescr"
            disabled
            type="text"
            placeholder="姓名"
            style="width: 100px"
          />
        </div>
      </el-form-item>
      <el-form-item
        label="岗位:"
        prop="position"
        :rules="
          state.formData.userType == '0' ? [{ required: true, message: '请选择岗位', trigger: 'blur' }] : []
        "
      >
        <el-select v-model="state.formData.position" placeholder="请选择岗位">
          <el-option
            v-for="item in positionDics"
            :key="item.code"
            :label="`${item.code} - ${item.name}`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色:" prop="roleIds">
        <el-cascader
          v-model="state.formData.roleIds"
          placeholder="请选择角色,可多选"
          :options="systemRoleList"
          :props="state.roleProp"
          :show-all-levels="false"
          collapse-tags
          collapse-tags-tooltip
        />
      </el-form-item>
    </el-form>
    <org-choose ref="orgChooseRef" @handle-sure="handleOrgCode"></org-choose>
  </draw-component>
</template>

<script setup lang="ts">
import { validatePhone, validateEmail, vlidateRealName } from '@/utils/validate'
import type { FormInstance, FormRules } from 'element-plus'
import { validUsersCodeExist, validCodeHas, editSubmit, addSubmit, getDetailById } from '../api'
import OrgChoose from './orgChoose.vue'
import useScrollStore from '@/store/modules/scrollTab'
import { debounce, spliceCodeName } from '@/utils/index'
import { PropType } from 'vue'
import { useProxy } from '@/utils/proxy'
// 自定义校验规则 code 账号
const validateCode = async (rule: any, value: any, callback: any) => {
  // 1.判断是否为空
  if (!value) {
    return callback(new Error('请输入账号'))
  }
  // 2.校验正则表达式
  let regUserCode = /^[a-zA-Z0-9_-]{1,30}$/
  if (!regUserCode.test(value)) {
    return callback(new Error('请输入30个字符以内的合法字符!'))
  }
  if (!state.userId) {
    // 3.调用接口查询是否存在该名称
    const { data } = await validUsersCodeExist<boolean>({ code: value })
    // 4.code 存在--校验失败; 不存在--校验成功(隐藏提示信息)
    if (data) {
      callback(new Error('账号不允许重复')) // 校验失败
    } else {
      callback() // 校验成功
    }
  } else {
    callback()
  }
}
const validateSuperior = async (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
  } else if (value && !state.formData.superiorDescr) {
    callback(new Error('无效的账号')) // 校验失败
  } else {
    callback()
  }
}
const props = defineProps({
  userTypeDics: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  sexDics: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  orgDics: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  positionDics: {
    type: Array as PropType<TselectOptions[]>,
    default: () => []
  },
  systemRoleList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
const emit = defineEmits(['handleAdded'])
const orgChooseRef = ref()
const formRef = ref<FormInstance>()
const { proxy } = useProxy()
const scrollStore = useScrollStore()
const companyList = computed(() => scrollStore.companyList)
const state = reactive({
  isSubmiting: false,
  userId: '',
  show: false,
  formData: {
    companyCode: '',
    code: '', // 账号
    password: '', // 密码，只有新增时使用
    userType: '', // 用户类型
    realName: '', // 真实姓名
    gender: '', // 性别
    phone: '', // 联系方式
    email: '', // 邮箱
    avatar: '', // 头像
    organizationType: '', // 组织类型 01-总部/02-分公司/03- 门店/04-仓库/05-行政部门
    organizationCode: '', // 所属组织
    organization: '', // 所属组织展示（编码-中文）
    status: '01', // 状态
    superior: '', // 上级负责人
    superiorDescr: '', // 上级负责人中文
    position: '', // 岗位
    roleIds: [] // 角色
  },
  rules: {
    companyCode: [{ required: true, message: '请选择企业', trigger: 'blur' }],
    code: [{ required: true, validator: validateCode, trigger: 'blur' }],
    password: [{ pattern: /^\d{6}$/, message: '请输入6位数字', trigger: 'change' }],
    userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
    realName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { validator: vlidateRealName, trigger: 'blur' }
    ],
    gender: { required: true, message: '请选择性别', trigger: 'change' },
    phone: [{ required: false, validator: validatePhone, trigger: 'blur' }],
    email: [{ required: false, validator: validateEmail, trigger: 'blur' }],
    superior: [{ required: false, validator: validateSuperior, trigger: 'blur' }],
    roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }]
  } as FormRules,
  roleProp: { multiple: true, emitPath: false, value: 'id', label: 'name', children: 'roles' }
})
const handleClose = () => {
  state.userId = ''
  state.formData = {
    companyCode: '',
    code: '', // 账号
    password: '', // 密码，只有新增时使用
    userType: '', // 用户类型
    realName: '', // 真实姓名
    gender: '', // 性别
    phone: '', // 联系方式
    email: '', // 邮箱
    avatar: '', // 头像
    organizationType: '', // 组织类型 01-总部/02-分公司/03- 门店/04-仓库/05-行政部门
    organizationCode: '', // 所属组织
    organization: '', // 所属组织展示（编码-中文）
    status: '01', // 状态
    superior: '', // 上级负责人
    superiorDescr: '', // 上级负责人中文
    position: '', // 岗位
    roleIds: [] // 角色
  }
  state.show = false
}
// 获取详情
const getDetail = async () => {
  let { data } = await getDetailById<any>(state.userId)
  const form = {} as any
  Object.keys(state.formData).forEach((item, index) => {
    if (item == 'superior') {
      form[item] = data.superiorCode
    } else if (item == 'roleIds') {
      form[item] = data.roles ? data.roles.map((v: any) => v.roleId) : []
    } else if (item == 'organization') {
      form[item] = spliceCodeName(data.organizationCode, data.organizationDescr)
    } else {
      form[item] = data[item] ?? ''
    }
  })
  console.log(form)
  state.formData = form
}
// 选择组织回调
const handleOrgCode = ({ organization, organizationCode }: any) => {
  state.formData.organization = organization
  state.formData.organizationCode = organizationCode
}
const handleSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const params = { ...state.formData } as any
      delete params.organization
      delete params.superiorDescr
      state.isSubmiting = true
      if (state.userId) {
        delete params.code
        delete params.password
        editSubmit(state.userId, params)
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
// 组织类型回调
const selectOrgType = () => {
  state.formData.organization = ''
  console.log(state.formData)
}
// 选择所属组织
const selectOrg = () => {
  if (!state.formData.organizationType) {
    return proxy.$message.msgError('请先选择组织类型')
  }
  orgChooseRef.value.state.searchForm.organizationType = state.formData.organizationType
  orgChooseRef.value.state.searchForm.companyCode = state.formData.companyCode
  orgChooseRef.value.state.orgCode = state.formData.organizationCode
  orgChooseRef.value.getList()
  orgChooseRef.value.state.show = true
}
//上传图片成功
const uploadSuccess = (imgUrl: string) => {
  state.formData.avatar = imgUrl
}
// 上级负责人回调
const superiorChange = debounce(
  async (val: string) => {
    if (!val) return
    let { data } = await validCodeHas<any>({
      userType: '0',
      companyCode: state.formData.companyCode,
      code: val
    })
    if (data) {
      state.formData.superiorDescr = data
    } else {
      state.formData.superiorDescr = ''
    }
    formRef.value?.validateField('superior')
  },
  500,
  false
)
defineExpose({ state, getDetail })
</script>

<style lang="scss" scoped>
.my-form-box2 {
  .header-title {
    margin-left: -18px;
    margin-bottom: 34px;
    .left-title {
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }
    .left-icon {
      display: inline-block;
      background: $blue;
      width: 4px;
      height: 26px;
      margin-right: 13px;
      border-radius: 2px;
    }
  }
  :deep(.el-radio__inner) {
    border-radius: 2px;
  }
  :deep(.el-radio__input.is-checked .el-radio__inner::after) {
    content: '';
    width: 7px;
    height: 3px;
    border: 1px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    display: block;
    position: absolute;
    top: 3px;
    left: 2px;
    transform: rotate(-45deg);
    border-radius: 0px;
    background: none;
  }
  // 密码样式
  :deep(.password-input) {
    color: #ff554e;
    position: absolute;
    font-size: 12px;
    line-height: 14px;
    height: 14px;
    bottom: -16px;
  }
}
</style>
