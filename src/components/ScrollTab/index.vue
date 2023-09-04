<template>
  <div id="scrollTab" class="scroll-tab-box">
    <template v-if="type == 'system'">
      <el-tabs
        v-if="systemList.length > 1"
        v-model="value"
        type="card"
        class="header-tabs"
        @tab-click="handleClick"
      >
        <template v-for="(item, index) in systemList" :key="index">
          <el-tab-pane :label="item.name" :name="item.code"></el-tab-pane>
        </template>
      </el-tabs>
    </template>
    <template v-else>
      <el-tabs
        v-if="companyList.length > 1"
        v-model="value"
        type="card"
        class="header-tabs"
        @tab-click="handleClick"
      >
        <template v-for="(item, index) in companyList" :key="index">
          <el-tab-pane :label="item.companyName" :name="item.companyCode"></el-tab-pane>
        </template>
      </el-tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import useTabStore from '@/store/modules/scrollTab'
import { PropType } from 'vue'
const props = defineProps({
  scrollVal: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'company' | 'system'>,
    default: 'system'
  }
})
const emits = defineEmits(['tabClick', 'update:scrollVal'])
const value = computed({
  get() {
    return props.scrollVal
  },
  set(value) {
    emits('update:scrollVal', value)
  }
})
const tabStore = useTabStore()
const systemList = computed(() => tabStore.systemList)
const companyList = computed(() => tabStore.companyList)
const handleClick = (tab: TabsPaneContext, event: Event) => {
  emits('update:scrollVal', tab.props.name)
  emits('tabClick')
}
</script>

<style lang="scss" scoped>
.scroll-tab-box {
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
    border-bottom-color: transparent;
  }
}
</style>
