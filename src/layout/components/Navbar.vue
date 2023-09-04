<template>
  <div class="nav c-flex c-justify-between c-items-center">
    <div class="nav-logo c-flex c-items-center">
      <div class="logo-box"><img src="../../assets/logo/logo.png" alt="logo" /></div>
      <div class="logo-text1">{{ title }}</div>
    </div>
    <div class="nav-user c-flex c-items-center">
      <div class="c-flex c-items-center">
        <el-avatar class="avator-box" :src="userStore?.userInfo.avatar || defaultAvatar" />
        <el-dropdown style="cursor: pointer" @command="handleCommand">
          <span class="el-dropdown-link items-center text-white">
            {{ userStore?.userInfo.realName }}
            <i class="iconfont icon-arrow-down1 ml5"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu :hide-on-click="false">
              <el-dropdown-item command="editPwd">
                <i class="iconfont icon-infofill"></i>
                修改密码
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="return-login ml20" @click="logout">退出登录 <i class="iconfont icon-tuichu ml5"></i></div>
      </div>
    </div>
  </div>
  <div style="height: 70px"></div>
</template>
<script setup lang="ts" name="navbar">
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'
import router from '@/router'
import { useProxy } from '@/utils/proxy'
const userStore = useUserStore()
const menuStore = useMenuStore()
const title = import.meta.env.VITE_APP_TITLE
const { proxy } = useProxy()
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const logout = () => {
  proxy.$message
    .confirm('确定注销并退出系统吗？')
    .then(() => {
      userStore.logOut().then(() => {
        proxy.$router.replace('/login')
        if (menuStore.sidebarRouters && menuStore.sidebarRouters.length) {
          menuStore.sidebarRouters.forEach((route: any) => {
            router.removeRoute(route.name)
          })
        }
      })
    })
    .catch((e) => e)
}
// 修改密码
const editPwd = () => {
  proxy.$router.push({ path: '/editPwd', query: { type: 'edit' } })
}
// 用户下拉命令
const handleCommand = (command: string) => {
  if (command === 'editPwd') {
    // 修改密码
    editPwd()
  }
}
</script>
<style lang="scss" scoped>
.nav {
  background: #0b0b0c;
  height: 70px;
  color: #ddd;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9;
  padding: 0 16px;
  box-sizing: border-box;
  &-logo {
    .logo-box {
      margin-right: 21px;
      img {
        width: 100%;
      }
    }
    .logo-text1 {
      font-size: 20px;
      white-space: nowrap;
      font-weight: 600;
      color: #fff;
    }
    .logo-text2 {
      margin-top: 6px;
      font-size: 16px;
      color: #ffffff;
    }
  }
  &-menu {
    .menu-tab {
      margin: 0 28px;
      cursor: pointer;
      &-item {
        display: block;
        padding: 14px 0 10px 0;
      }
      &:hover {
        color: #fff;
        font-weight: 600;
      }
    }
    .menu-border {
      display: block;
      top: 26px;
      left: 0;
      right: 0;
      background-color: $nav-menu-background;
      border: 2px solid $nav-menu-background;
      border-radius: 4px;
    }
    .menu-tab-item {
      white-space: nowrap;
    }

    .menu-active {
      .menu-tab-item {
        color: #fff;
        font-weight: 600;
      }
      .menu-border {
        background-color: $--color-primary;
        border: 2px solid $--color-primary;
      }
    }
  }
  &-user {
    color: #fff;
    .avator-box {
      width: 27px;
      height: 27px;
      margin-right: 10px;
    }

    .icon-jiantoudown {
      font-size: 12px;
    }
  }
}
.text-white {
  font-size: 16px;
  color: #fff;
}
.return-login {
  cursor: pointer;
}
</style>
