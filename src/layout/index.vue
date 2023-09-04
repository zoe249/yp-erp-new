<template>
  <navbar></navbar>
  <side-bar :block-menu="menus"> </side-bar>
</template>

<script setup lang="ts" name="Layout">
import Navbar from './components/Navbar.vue'
import SideBar from './components/Sidebar/index.vue'
import useMenuStore from '@/store/modules/menu'
const menuStore = useMenuStore()
const menus = computed(() => menuStore.sidebarRouters)
</script>

<style lang="scss" scoped>
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.sidebar-container {
  width: 200px;
  height: 100%;
  position: absolute;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  background: $mobile-menu-background;
}
</style>
