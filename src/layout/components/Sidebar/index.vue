<template>
  <section class="section-box">
    <div id="main" class="page-frame" :class="isCollapse ? 'collapseLeft' : 'noCollapseLeft'">
      <tags-view :is-collapse="isCollapse"></tags-view>
      <app-main />
    </div>

    <div class="aside" :class="isCollapse ? 'isCollapse' : 'noCollapse'" @mouseleave="showMenuPanel(false)">
      <ul class="main-menus">
        <li
          class="menu-item"
          :class="router.currentRoute.value.path === '/index' ? 'active' : ''"
          @mouseenter="showMenuPanel(false)"
          @click="router.push('/index')"
        >
          <i class="iconfont icon-shouye3"></i>
          <transition mode="out-in" appear>
            <span v-if="!isCollapse" class="item-title"> 首页 </span>
          </transition>
        </li>
        <li
          v-for="(menu, index) in blockMenu"
          :key="index"
          class="menu-item"
          :class="activePath === menu.path ? 'active' : ''"
          @mouseenter="showSubMenus('mouse', menu)"
          @click="showSubMenus('click', menu)"
        >
          <img v-if="menu.meta.icon.includes('http')" class="img-icon" :src="menu.meta.icon" />
          <i v-else class="iconfont" :class="menu.meta.icon"></i>
          <!--显示隐藏加动画缓冲效果-->
          <transition mode="out-in" appear>
            <span v-if="!isCollapse" class="item-title">{{ menu.meta.title }}</span>
          </transition>
        </li>
      </ul>
      <div class="collape-wrap" :class="isCollapse ? 'isCollapse' : 'noCollapse'" @click="handleCollapse">
        <i class="iconfont" :class="!isCollapse ? 'icon-caidanshouqi ' : 'icon-caidanzhankai'"></i>
      </div>
      <transition name="main" mode="out-in" appear>
        <div v-if="ifShowMenuPanel && subMenusData.length" class="sub-menus">
          <ul v-for="(menu, index) in subMenusData" :key="index">
            <ul class="ul-wrap">
              <li class="menu-items">
                <router-link :to="menu.path" class="menu-items">
                  <span class="menu-items-text">{{ menu.meta.title }}</span>
                </router-link>
              </li>
            </ul>
          </ul>
        </div>
      </transition>
    </div>
  </section>
</template>
<script setup lang="ts">
import AppMain from '../AppMain.vue'
import TagsView from '../TagsView/index.vue'
import useMenuStore from '@/store/modules/menu'
import { PropType } from 'vue'
const props = defineProps({
  blockMenu: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
const router = useRouter()
const menuStore = useMenuStore()
const activePath = ref<string>() // 当前激活的路由
const ifShowMenuPanel = ref(false) // 二级路由显示隐藏
const subMenusData = ref<any>([]) // 二级路由
const isCollapse = ref(false)
// 展开收起
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
// 显示隐藏二级菜单
const showMenuPanel = (bol: boolean) => {
  ifShowMenuPanel.value = bol
}
const showSubMenus = (evt: string, menu: any) => {
  menuStore.setCurrentPath(menu)
  // 如果有子级，传递子级数据，否则直接跳转一级路由
  if (menu.children) {
    subMenusData.value = menu.children
    if (menu.children.length) {
      ifShowMenuPanel.value = true
    } else if (evt === 'click') {
      ifShowMenuPanel.value = false
    } else {
      // hover时不跳转路由
      ifShowMenuPanel.value = false
    }
  } else {
    ifShowMenuPanel.value = false
  }
}
// 监听路由变化，高亮子菜单对应的父菜单
watch(
  () => router.currentRoute.value.path,
  () => {
    activePath.value = router.currentRoute.value.meta.group as string
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss" scoped>
.section-box {
  height: calc(100% - 70px);
  .aside {
    transition: width 0.5s;
    position: fixed;
    top: 70px;
    bottom: 0;
    height: 100%;
    background: $asideBgColor;
    z-index: 999;

    .sub-menus {
      z-index: 998;
      position: absolute;
      left: calc($subMenuWidth - 12px);
      top: 0;
      width: $subMenuWidth;
      height: 100%;
      background-color: #fff;
      z-index: 9999;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      overflow: auto;
      font-size: $menuFontSize;
      .menu-items {
        width: 100%;
        height: $subMenuLiHeight;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        color: $mainMenuActiveColor;
        .menu-items-text {
          margin-left: 20px;
        }
        &:hover {
          background-color: $subMenuActiveColor;
          color: $mainColor;
          a {
            border-right: 4px solid $mainColor;
          }
        }
        .route-items {
          width: 100%;
          border-radius: 8px;
          margin: auto;
          height: $subMenuLiHeight;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: $mainMenuActiveColor;
          .route-items-text {
            display: inline-block;
            margin-left: 30px;
          }
        }
      }
    }
    .main-menus {
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .menu-item {
        /*width: 100%;*/
        padding: 0 18px;
        height: $menuLiHeight;
        font-size: $menuFontSize;
        color: #fff;
        display: flex;
        align-items: center;
        cursor: pointer;
        .iconfont {
          margin-right: 8px;
        }
        .img-icon {
          margin-right: 8px;
          width: 17px;
          height: 17px;
          border-radius: 2px;
        }
        &:hover {
          background-color: $mainMenuActiveColor;
        }
        .item-title {
          white-space: nowrap;
        }
      }
      .active {
        background-color: $mainMenuActiveColor;
      }
    }
    .collape-wrap {
      position: absolute;
      bottom: 84px;
      margin-left: 18px;
      color: #fff;
      cursor: pointer;
    }
    .v-enter-active,
    .v-leave-active {
      transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
  }

  // router-link 内置选中状态 子级菜单使用
  .router-link-active {
    background-color: $subMenuActiveColor;
    color: $mainColor !important;
    border-right: 4px solid $mainColor;
  }
  .page-frame {
    height: 100%;
    position: relative;
  }
  .collapseLeft {
    margin-left: $minMenuWidth;
  }
  .noCollapseLeft {
    margin-left: $menuWidth;
  }
  .isCollapse {
    width: $minMenuWidth;
  }
  .noCollapse {
    width: $menuWidth;
  }
  // 加载路由的动画
  .main-enter-active {
    transition: 0.5s;
  }
  .main-leave-active {
    transition: 1s;
  }
  .main-enter-from {
    opacity: 0;
    margin-left: -20px;
  }
  .main-leave-to {
    opacity: 0;
    margin-left: 20px;
  }
}
</style>
