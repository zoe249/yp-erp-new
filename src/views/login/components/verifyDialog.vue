<template>
  <el-dialog
    v-model="showDialog"
    class="my-valid-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <verify-img
      :w="verifyConfig.canvasWidth"
      :h="verifyConfig.canvasHeight"
      :yheight="verifyConfig.yheight"
      :xwidth="verifyConfig.xwidth"
      :small-img="verifyConfig.miniImgUrl"
      :big-img="verifyConfig.imgUrl"
      :verify-status="verifyConfig.verifyStatus"
      :verify-msg="verifyConfig.verifyMsg"
      @success="success"
      @reset-verify-status="resetVerifyStatus"
      @refresh="refresh"
      @close-verify-img="handleClose"
    ></verify-img>
  </el-dialog>
</template>
<script setup lang="ts">
import VerifyImg from './verifyImg.vue'
const props = defineProps({
  showValidDialog: {
    type: Boolean,
    default: false
  },
  verifyConfig: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['refresh', 'success', 'resetVerifyStatus', 'closeDialog', 'update:showValidDialog'])
const showDialog = computed({
  // 表单对象,计算属性防止子改父
  get() {
    return props.showValidDialog
  },
  set(value) {
    emit('update:showValidDialog', value)
  }
})
const handleClose = () => {
  emit('closeDialog')
}

const success = (e: number) => {
  emit('success', e)
}

const refresh = () => {
  emit('refresh')
}

const resetVerifyStatus = () => {
  emit('resetVerifyStatus')
}
</script>
<style lang="scss">
.my-valid-dialog {
  width: 500px !important;
  border-radius: 6px !important;
  .el-dialog__header {
    text-align: left;
    .el-dialog__title {
      font-size: 14px;
      color: #666;
    }
    .el-dialog__headerbtn {
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
      .el-icon {
        font-size: 16px;
        color: #666;
      }
    }
  }

  .el-dialog__body {
    padding: 0 16px 20px 16px;
  }
}
</style>
