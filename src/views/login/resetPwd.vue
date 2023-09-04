<template>
  <div class="reset-view">
    <div class="reset-box">
      <div class="tab-box df jcc">
        <div class="tab-item">重置密码</div>
      </div>
      <el-form ref="resetRef" :model="resetObj.formData" :rules="resetObj.rules">
        <el-form-item prop="username" label="">
          <el-input
            v-model="resetObj.formData.username"
            placeholder="请输入账号"
            type="text"
            clearable
            autocomplete="off"
          >
            <template #prefix>
              <i class="iconfont icon-zhanghao"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="">
          <el-input
            v-model="resetObj.formData.phone"
            placeholder="请输入手机号"
            type="text"
            clearable
            autocomplete="off"
          >
            <template #prefix>
              <i class="iconfont icon-shoujihao"></i>
            </template>
          </el-input>
        </el-form-item>
        <div class="code-item df ait jcsb">
          <el-form-item prop="verificationCode" label="">
            <el-input v-model="resetObj.formData.verificationCode" placeholder="请输入验证码" type="text">
              <template #prefix>
                <i class="iconfont icon-xin"></i>
              </template>
            </el-input>
          </el-form-item>
          <div class="code-btn" @click="getCode">
            {{
              resetObj.isSendCode
                ? resetObj.sendSubmiting
                  ? '获取中'
                  : `( ${resetObj.clearNum} )`
                : '获取验证码'
            }}
          </div>
        </div>
        <el-form-item label="" prop="newPassword">
          <el-input
            v-model="resetObj.formData.newPassword"
            placeholder="请输入新密码"
            type="password"
            clearable
            show-password
          >
            <template #prefix>
              <i class="iconfont icon-mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="confirmPassword">
          <el-input
            v-model="resetObj.formData.confirmPassword"
            placeholder="请确认新密码"
            type="text"
            clearable
            show-password
          >
            <template #prefix>
              <i class="iconfont icon-mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <div class="submit-btn" @click="save()">保存</div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { validatePhone } from '@/utils/validate'
import { sendVerifyCode, resetPwd } from './api'
import { useProxy } from '@/utils/proxy'
const validatorPsd = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入确认密码'))
  } else if (resetObj.formData.newPassword && value != resetObj.formData.newPassword) {
    callback(new Error('确认密码和新密码不一致！请重新输入'))
  } else if (value && !resetObj.formData.newPassword) {
    callback(new Error('请先输入新密码'))
  } else {
    callback()
  }
}
const { proxy } = useProxy()
const resetRef = ref<FormInstance>()
let clearId: any = null
const resetObj = reactive({
  clearNum: 0, // 验证码计时器
  isSendCode: false,
  sendSubmiting: false,
  formData: { username: '', phone: '', verificationCode: '', newPassword: '', confirmPassword: '' },
  rules: {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    newPassword: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { pattern: /^\d{6}$/, message: '请输入6位数字', trigger: 'blur' }
    ],
    confirmPassword: [{ validator: validatorPsd, trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhone, trigger: 'blur' }
    ],
    verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  } as FormRules
})
// 获取验证码
const getCode = async () => {
  await resetRef.value?.validateField('phone', (valid) => {
    if (valid) {
      if (resetObj.isSendCode) return
      resetObj.isSendCode = true
      resetObj.sendSubmiting = true
      sendVerifyCode({ phone: resetObj.formData.phone, type: 'forgot' })
        .then((res) => {
          resetObj.sendSubmiting = false
          resetObj.clearNum = 30
          clearId = setInterval(() => {
            resetObj.clearNum--
            if (resetObj.clearNum == 0) {
              clearInterval(clearId)
              resetObj.clearNum = 30
              resetObj.isSendCode = false
            }
          }, 1000)
        })
        .catch(() => {
          resetObj.isSendCode = false
          resetObj.sendSubmiting = false
        })
    }
  })
}
// 保存
const save = async () => {
  await resetRef.value?.validate(async (valid) => {
    if (valid) {
      const params = { ...resetObj.formData } as any
      delete params.username
      await resetPwd(resetObj.formData.username, params)
      proxy.$message.msgSuccess('重置成功')
      setTimeout(() => {
        proxy.$router.push('/login')
      }, 700)
    }
  })
}
</script>

<style lang="scss" scoped>
.reset-view {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  .reset-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 480px;
    background: #ffffff;
    box-shadow: 0px 0px 29px 1px rgba(99, 140, 236, 0.16);
    border-radius: 11px 11px 11px 11px;
    padding: 42px 96px;
    box-sizing: border-box;
    .tab-box {
      font-size: 22px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 34px;
      .tab-item {
        letter-spacing: 1px;
        cursor: pointer;
        position: relative;
        color: $blue;
        &::after {
          content: '';
          width: 100%;
          height: 6px;
          background: $blue;
          border-radius: 4px 4px 4px 4px;
          position: absolute;
          bottom: -10px;
          left: 0px;
        }
      }
    }
    .code-item {
      :deep(.el-form-item) {
        width: 145px;
      }
      .code-btn {
        cursor: pointer;
        width: 101px;
        height: 31px;
        line-height: 31px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid $blue;
        text-align: center;
        font-size: 16px;
        color: $blue;
      }
    }
    .submit-btn {
      width: 112px;
      height: 43px;
      background: $blue;
      border-radius: 4px 4px 4px 4px;
      text-align: center;
      line-height: 43px;
      font-size: 16px;
      letter-spacing: 1px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      margin: 34px auto 0px;
    }
    .iconfont {
      font-size: 20px;
      color: #666;
    }
    :deep(.el-form-item) {
      margin-bottom: 20px;
      position: relative;
      border-radius: 0;
    }
    :deep(.el-form-item.is-error .el-input__wrapper) {
      box-shadow: none;
      border-bottom: 1px solid #ff554e;
      border-radius: 0;
    }
    :deep(.el-form-item__error) {
      padding-left: 44px;
      padding-top: 6px;
    }
    :deep(.el-input__wrapper, .el-input__wrapper.hover, .el-input__wrapper.is-focus) {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #ccc;
      box-shadow: none;
    }
    :deep(.el-input__inner) {
      padding-left: 4px;
      border-radius: 0;
    }
  }
}
</style>
