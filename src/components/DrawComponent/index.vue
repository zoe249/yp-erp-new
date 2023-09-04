<template>
  <el-drawer
    v-if="drawerVisible"
    :model-value="drawerVisible"
    :direction="direction"
    :size="size"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :append-to-body="appendToBody"
    custom-class="my-drawer"
  >
    <template #header>
      <div class="demo-drawer__header">
        <span class="left-title c-flex c-items-center"> <i class="left-icon"></i>{{ title }}</span>
      </div>
    </template>
    <template #default>
      <div class="demo-drawer__body">
        <slot></slot>
      </div>
    </template>
    <template #footer>
      <div v-if="showBottomBtn" class="handle-btn">
        <el-button class="btn cancel" @click="handleClose">取消</el-button>
        <el-button class="btn save" type="primary" @click="handleSubmit">保存</el-button>
      </div>
      <slot name="footBtn"></slot>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
const props = defineProps({
  // 是否显示抽屉
  drawerVisible: {
    type: Boolean,
    default: false
  },
  // 抽屉大小
  size: {
    type: [Number, String],
    default: '50%'
  },
  // 抽屉打开方向
  direction: {
    type: String as any,
    default: 'rtl'
  },
  // 抽屉标题
  title: {
    type: String,
    default: ''
  },
  showBottomBtn: {
    type: Boolean,
    default: true
  },
  appendToBody: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['closeDrawer', 'saveDrawer'])
// 取消抽屉事件
const handleClose = () => {
  emits('closeDrawer')
}
// 保存
const handleSubmit = () => {
  emits('saveDrawer')
}
</script>
<style lang="scss">
.my-drawer {
  .el-drawer__header {
    padding: 18px;
    margin-bottom: 0px;
  }
  .el-drawer__body {
    padding: 18px 36px;
  }
}
</style>
<style lang="scss" scoped>
.my-drawer {
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
  .handle-btn {
    text-align: center;
    margin-bottom: 20px;
    .btn {
      width: 96px;
      height: 32px;
      border-radius: 4px 4px 4px 4px;
      font-size: 14px;
    }

    .cancel {
      border: 1px solid $base-menu-color-active;
      margin-right: 18px;
      color: $base-menu-color-active;
    }
  }
}
</style>
