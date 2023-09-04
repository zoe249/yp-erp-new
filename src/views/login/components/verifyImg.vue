<template>
  <div class="my-sv-box" :style="{ width: w + 'px', height: h + 60 + 'px' }" onselectstart="return false">
    <div
      v-if="verifyStatus === 'fail'"
      v-loading="state.loading"
      class="loading-mask"
      element-loading-background="rgba(0, 0, 0, 0.3)"
      element-loading-text="正在加载中， 请稍后。。。"
    >
      <div class="loading-content">
        <el-icon><Warning /></el-icon>
        <p>{{ verifyMsg + '请重试' }}</p>
      </div>
    </div>
    <canvas
      ref="canvas"
      :width="w"
      :height="h"
      class="slide-canvas"
      @mousedown="sliderDown"
      @touchstart="touchStartEvt"
      @touchmove="touchMoveEvt"
      @touchend="touchEndEvt"
    ></canvas>
    <canvas ref="block" :width="w" :height="h" class="canvas-block"></canvas>
    <!-- <!- 滑动条容器 -> -->
    <div
      class="slider"
      :class="{
        active: verifyStatus === 'active',
        success: verifyStatus === 'success',
        fail: verifyStatus === 'fail'
      }"
    >
      <div class="slider-mask" :style="{ width: state.sliderMaskWidth }">
        <!-- <!- 滑动块 -> -->
        <div
          class="slider-inner"
          :style="{ left: state.sliderLeft }"
          @mousedown="sliderDown"
          @touchstart="touchStartEvt"
          @touchmove="touchMoveEvt"
          @touchend="touchEndEvt"
        >
          <i class="iconfont icon-arrow-right-bold"></i>
        </div>
      </div>
      <span class="slider-text">{{ text }}</span>
    </div>
  </div>
  <div class="my-option-icons">
    <i class="iconfont icon-icon_yiwen"></i>
    <div>
      <i class="iconfont icon-shuaxin3" @click="refresh"></i>&nbsp;&nbsp;
      <i class="iconfont icon-chacha" @click="closeVerifyImg"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
interface State {
  canvasCtx: any
  blockCtx: any
  block: any
  blockX: string
  blockY: string
  originX: number
  isMouseDown: boolean
  sliderLeft: string
  loadFlag: boolean
  sliderMaskWidth: string
  loading: boolean
}
const props = defineProps({
  // canvas宽度
  w: {
    type: Number,
    default: 460
  },
  // canvas高度
  h: {
    type: Number,
    default: 256
  },
  verifyStatus: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: '向右拖动滑块完成验证'
  },
  // 小的卡图
  smallImg: {
    type: String,
    default: ''
  },
  // 大的背景图
  bigImg: {
    type: String,
    default: ''
  },
  xwidth: {
    type: Number,
    default: 0
  },
  yheight: {
    type: Number,
    default: 0
  },
  verifyMsg: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['refresh', 'success', 'resetVerifyStatus', 'closeVerifyImg'])
const state = reactive<State>({
  canvasCtx: {},
  blockCtx: {},
  block: {},
  blockX: '',
  blockY: '',
  originX: 0,
  isMouseDown: false,
  sliderLeft: '0px',
  loadFlag: false,
  sliderMaskWidth: '',
  loading: false
})
// ref获取canvas
const block = ref()
const canvas = ref()

const createImg = (src: string, onload: any) => {
  const img: any = document.createElement('img')
  // img.crossOrigin = 'Anonymous'
  img.src = src
  img.onload = onload
  img.error = () => {
    console.error('Background image failed to load')
  }
  return img
}

onMounted(() => {
  initDom()
  bindEvt()
})
// 加载canvas
const initDom = () => {
  state.block = block.value
  state.canvasCtx = canvas.value.getContext('2d')
  state.blockCtx = block.value.getContext('2d')
  initImg()
}
// 绘制canvas图片
const initImg = () => {
  state.loadFlag = false
  // 小图
  const smallImg = createImg(props.smallImg, () => {
    state.blockCtx.drawImage(smallImg, props.xwidth, props.yheight, 50, 50)
  })
  // 大图
  const bigImg = createImg(props.bigImg, () => {
    state.canvasCtx.drawImage(bigImg, 0, 0, props.w, props.h)
  })
}
// 监听鼠标事件
const bindEvt = () => {
  // 鼠标移动
  const moveEvt = (e: any) => {
    if (!state.isMouseDown) return
    const moveX = e.clientX - state.originX
    if (moveX < 40 || moveX + 40 >= props.w) return
    state.sliderLeft = moveX + 'px'
    const blockLeft = ((props.w - 40) / (props.w - 40)) * moveX
    state.block.style.left = blockLeft + 'px'
    state.sliderMaskWidth = moveX + 40 + 'px'
  }
  const upEvt = (e: any) => {
    if (!state.isMouseDown) return
    state.isMouseDown = false
    if (e.clientX === state.originX) return
    const left = parseInt(state.block.style.left)
    emit('success', left)
  }
  document.addEventListener('mousemove', moveEvt)
  document.addEventListener('mouseup', upEvt)
}
// 鼠标按下滑块
const sliderDown = (e: any) => {
  if (props.verifyStatus === 'success') return
  state.originX = e.clientX
  state.isMouseDown = true
}
// 开始拖动滑块
const touchStartEvt = (e: any) => {
  if (props.verifyStatus === 'success') return
  state.originX = e.changedTouches[0].pageX
  state.isMouseDown = true
}
// 滑块滑动的过程
const touchMoveEvt = (e: any) => {
  if (!state.isMouseDown) return
  // 计算滑动的距离
  const moveX = e.changedTouches[0].pageX - state.originX
  // 40 为下方正方形滑块的宽度
  if (moveX < 0 || moveX + 40 >= props.w) return
  // 滑块距离左侧长度
  state.sliderLeft = moveX + 'px'
  let blockLeft = ((props.w - 40 - 20) / (props.w - 40)) * moveX
  state.block.style.left = blockLeft + 'px'
  state.sliderMaskWidth = moveX + 40 + 'px'
}
const touchEndEvt = (e: any) => {
  if (!state.isMouseDown) return
  state.isMouseDown = false
  if (e.changedTouches[0].pageX === state.originX) return
  const left = parseInt(state.block.style.left)
  emit('success', left)
}
const reset = () => {
  state.sliderLeft = '0px'
  state.block.style.left = 0
  state.sliderMaskWidth = '0px'
  // canvas
  const { w, h } = props
  state.canvasCtx.clearRect(0, 0, w, h)
  state.blockCtx.clearRect(0, 0, w, h)
  state.block.width = w
  initImg()
  emit('resetVerifyStatus', '')
}
const refresh = () => {
  reset()
  emit('refresh')
}
const closeVerifyImg = () => {
  emit('closeVerifyImg')
}
</script>

<style lang="scss" scoped>
.my-sv-box {
  position: relative;
  .loading-mask {
    width: 100%;
    height: 140px;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    color: #fff;
    .loading-content {
      text-align: center;
      margin-top: 50px;
      .el-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
    }
  }
  .canvas-block {
    position: absolute;
    left: 0;
    top: 0;
  }
  .sv-refresh {
    display: inline-block;
    position: absolute;
    z-index: 998;
    cursor: pointer;
    right: 8px;
    top: 8px;
    color: #fff;
    font-size: 18px;
  }
  .slider {
    position: absolute;
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-top: 12px;
    border-radius: 25px;
    color: #45494c;
    background: rgba(242, 242, 242, 1);
    .slider-text {
      color: #999;
      font-size: 20px;
    }
    .slider-mask {
      position: absolute;
      left: -1px;
      top: -1px;
      height: 50px;
      border-radius: 25px;
      background: $mainColor;
      .slider-inner {
        position: absolute;
        top: 0;
        right: 0;
        width: 49px;
        height: 49px;
        border-radius: 50px;
        background: #fff;
        box-shadow: rgb(0 0 0 / 20%) 0px 0px 2px 0px;
        cursor: pointer;
        transition: background 0.2s linear;

        .slider-icon {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 20px;
          color: #666;
        }
        &:hover {
          border: 1px solid $mainColor;
        }
      }
    }
  }
  .active .slider-mask {
    border: 1px solid #1991fa;
  }
  .active .slider-inner {
    top: -1px !important;
    border: 1px solid #1991fa;
    background-color: #1991fa !important;
  }
  .success .slider-mask {
    border: 1px solid #52ccba;
  }

  .success .slider-inner {
    top: -1px !important;
    border: 1px solid #52ccba;
    background-color: #52ccba !important;
  }

  .success .slider-icon {
    background-position: 0 0 !important;
  }
  .fail .slider-icon {
    top: 14px;
    background-position: 0 -82px !important;
  }

  .fail .slider-mask {
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
  }

  .fail .slider-inner {
    top: -1px !important;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
  }

  .active .slider-text,
  .success .slider-text,
  .fail .slider-text {
    display: none;
  }
}
.my-option-icons {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  .iconfont {
    cursor: pointer;
  }
}
</style>
