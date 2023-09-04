<template>
  <div class="login-box">
    <div class="login-icon"></div>
    <div class="bottom-text">Copyright © 2016-2020 威海市 悦朋智能科技有限公司 All rights reserved</div>
    <div class="form-box">
      <div class="title">{{ title }}</div>
      <div class="form-content">
        <div class="tab-box df aic jcsb">
          <div class="tab-item" :class="loginObj.tabChange == '1' ? 'active' : ''" @click="tabChange('1')">
            账号登录
          </div>
          <div class="tab-item" :class="loginObj.tabChange == '2' ? 'active' : ''" @click="tabChange('2')">
            手机号登录
          </div>
        </div>
        <el-form ref="loginRef" :model="loginObj.formData" :rules="loginObj.rules">
          <div v-if="loginObj.tabChange == '1'">
            <el-form-item prop="username" label="">
              <el-input
                v-model="loginObj.formData.username"
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
            <el-form-item prop="password" label="">
              <el-input
                v-model="loginObj.formData.password"
                placeholder="请输入密码"
                type="password"
                clearable
                show-password
              >
                <template #prefix>
                  <i class="iconfont icon-mima"></i>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="loginObj.tabChange == '2'">
            <el-form-item prop="phone" label="">
              <el-input
                v-model="loginObj.formData.phone"
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
              <el-form-item prop="verifyCode" label="">
                <el-input v-model="loginObj.formData.verifyCode" placeholder="请输入验证码" type="text">
                  <template #prefix>
                    <i class="iconfont icon-xin"></i>
                  </template>
                </el-input>
              </el-form-item>
              <div class="code-btn" @click="getCode">
                {{
                  loginObj.isSendCode
                    ? loginObj.sendSubmiting
                      ? '获取中'
                      : `( ${loginObj.clearNum} )`
                    : '获取验证码'
                }}
              </div>
            </div>
          </div>
          <div class="top-button-box" @click="handleLogin"><span>登录</span></div>
          <div v-if="loginObj.tabChange == '1'" class="bottom-btn df aic jcsb">
            <el-checkbox v-model="loginObj.formData.remember" class="item-checkbox">记住密码</el-checkbox>
            <div class="item-reset" @click="router.push('/resetPwd')">
              <i class="iconfont icon-reset1"></i>重置密码
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <verify-dialog
      v-if="loginObj.showValidDialog"
      :show-valid-dialog="loginObj.showValidDialog"
      :verify-config="loginObj.verifyConfig"
      @success="verifySuccess"
      @reset-verify-status="resetVerifyStatus"
      @refresh="verifyRefresh"
      @close-dialog="verifyCloseDialog"
    ></verify-dialog>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'
import useScrollStore from '@/store/modules/scrollTab'
import { getQuery } from '@/utils/index'
import type { FormInstance, FormRules } from 'element-plus'
import { validatePhone } from '@/utils/validate'
import cache from '@/plugins/cache'
import { getVerifyImage, login, sendVerifyCode } from './api'
import { setToken } from '@/utils/auth'
import { systemCode } from '@/utils/config'
import VerifyDialog from './components/verifyDialog.vue'
const title = import.meta.env.VITE_APP_TITLE
const loginRef = ref<FormInstance>()
let clearId: any = null
const userStore = useUserStore()
const menuStore = useMenuStore()
const scrollStore = useScrollStore()
const router = useRouter()
const loginObj = reactive({
  showValidDialog: false, //图形验证开关
  tabChange: '1', // 选项卡切换
  clearNum: 0, // 验证码计时器
  isSendCode: false,
  sendSubmiting: false,
  formData: {
    username: '',
    password: '',
    phone: '',
    verifyCode: '',
    verifyId: '',
    systemCode: systemCode,
    remember: false,
    moved: 0
  },
  rules: {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhone, trigger: 'blur' }
    ],
    verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  } as FormRules,
  verifyConfig: {
    canvasWidth: 460,
    canvasHeight: 256,
    xwidth: 0,
    yheight: 0,
    imgUrl: '',
    miniImgUrl: '',
    verifyStatus: '',
    verifyMsg: ''
  }
})
const tabChange = (type: string) => {
  if (loginObj.tabChange == type) return
  loginObj.tabChange = type
}
// 获取验证码
const getCode = async () => {
  await loginRef.value?.validateField('phone', (valid) => {
    if (valid) {
      if (loginObj.isSendCode) return
      loginObj.isSendCode = true
      loginObj.sendSubmiting = true
      sendVerifyCode({ phone: loginObj.formData.phone, type: 'login' })
        .then((res) => {
          loginObj.sendSubmiting = false
          loginObj.clearNum = 30
          clearId = setInterval(() => {
            loginObj.clearNum--
            if (loginObj.clearNum == 0) {
              clearInterval(clearId)
              loginObj.clearNum = 30
              loginObj.isSendCode = false
            }
          }, 1000)
        })
        .catch(() => {
          loginObj.isSendCode = false
          loginObj.sendSubmiting = false
        })
    }
  })
}
const handleLogin = async () => {
  await loginRef.value?.validate((valid) => {
    if (valid) {
      if (loginObj.tabChange == '1') {
        getVerifyImg()
      } else {
        loginSubmit()
      }
    }
  })
}

// 打开滑块验证
const getVerifyImg = () => {
  getVerifyImage().then((res: any) => {
    loginObj.showValidDialog = true
    let _res = res.data
    // 滑块为后端传的ID, 验证码为前端生成的guid
    loginObj.formData.verifyId = _res.id
    loginObj.verifyConfig.imgUrl = 'data:image/png;base64,' + _res.bigImage
    loginObj.verifyConfig.miniImgUrl = 'data:image/png;base64,' + _res.smallImage
    loginObj.verifyConfig.yheight = _res.yheight
    loginObj.verifyConfig.xwidth = _res.xwidth
  })
}
// 滑动验证成功
const verifySuccess = (e: number) => {
  loginObj.formData.moved = e
  loginSubmit()
}
const verifyRefresh = () => getVerifyImg()
const resetVerifyStatus = (e: string) => {
  loginObj.verifyConfig.verifyStatus = e
}
const verifyCloseDialog = () => {
  loginObj.showValidDialog = false
}
// 调用登录接口登录
const loginSubmit = () => {
  const { username, password, phone, verifyCode, systemCode, remember, verifyId, moved } = loginObj.formData
  login(
    loginObj.tabChange,
    loginObj.tabChange == '1'
      ? { username, password, verifyId, moved, systemCode, remember }
      : { phone, verifyCode, systemCode, remember }
  )
    .then((res: any) => {
      setToken(res.data.tokenValue)
      if (loginObj.formData.remember) {
        cache.local.setJSON('accountInfo', {
          username: loginObj.formData.username,
          password: loginObj.formData.password
        })
      } else {
        cache.local.remove('accountInfo')
      }
      if (loginObj.tabChange == '1') {
        loginObj.verifyConfig.verifyStatus = 'success'
        loginObj.showValidDialog = false
        loginObj.verifyConfig.verifyStatus = ''
      }
      let redirect = getQuery('redirect')
      userStore.getInfoData().then(() => {
        menuStore.changeisSetMenu(false)
        router.push({ path: redirect || '/' })
      })
    })
    .catch((err: any) => {
      if (loginObj.tabChange == '1') {
        loginObj.verifyConfig.verifyMsg = err.data.message || ''
        setTimeout(() => {
          loginObj.showValidDialog = false
          loginObj.verifyConfig.verifyStatus = ''
        }, 1000)
      }
    })
}
// 初始化逻辑
const init = () => {
  let accountInfo: any = cache.local.getJSON('accountInfo')
  if (accountInfo) {
    loginObj.formData.username = accountInfo.username || ''
    loginObj.formData.password = accountInfo.password || ''
    loginObj.formData.remember = accountInfo.username && accountInfo.password ? true : false
  }
}
init()
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  min-width: 1100px;
  min-height: 600px;
  height: 100%;
  background: url(../../assets/images/login-bg.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  .form-box {
    position: absolute;
    top: 50%;
    right: 11%;
    transform: translateY(-50%);
    .title {
      font-size: 32px;
      font-weight: 500;
      color: #333333;
      text-align: center;
      margin-bottom: 16px;
    }
    .form-content {
      width: 450px;
      height: 390px;
      background: #ffffff;
      box-shadow: 0px 0px 29px 1px rgba(99, 140, 236, 0.16);
      border-radius: 11px 11px 11px 11px;
      text-align: center;
      padding: 45px 96px;
      box-sizing: border-box;
      .tab-box {
        width: 100%;
        font-size: 22px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 60px;
        .tab-item {
          letter-spacing: 1px;
          cursor: pointer;
          position: relative;
        }
        .active {
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
      .top-button-box {
        margin-top: 45px;
        height: 43px;
        line-height: 43px;
        letter-spacing: 12px;
        span {
          margin-left: 12px;
        }
      }
      .code-item {
        :deep(.el-form-item) {
          margin-bottom: 0px;
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
      .bottom-btn {
        margin-top: 6px;
        color: #333333;
        .item-checkbox {
          :deep(.el-checkbox__label) {
            font-size: 16px;
          }
        }
        .item-reset {
          font-size: 16px;
          cursor: pointer;
          .iconfont {
            font-size: 16px;
            color: #999;
            margin-right: 4px;
            position: relative;
            top: 1px;
          }
        }
      }
    }
  }
  .login-icon {
    position: absolute;
    top: 56px;
    left: 67px;
    width: 95px;
    height: 65px;
    background: url(../../assets/logo/login-logo.png) no-repeat center center;
    background-size: 100% 100%;
  }
  .bottom-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 34px;
    font-size: 16px;
    color: #ffffff;
  }
}
</style>
