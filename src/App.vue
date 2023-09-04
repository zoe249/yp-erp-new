<template>
  <Suspense timeout="0">
    <template #default>
      <el-config-provider :locale="zhCn">
        <router-view v-slot="{ Component }">
          <component :is="Component"></component>
        </router-view>
      </el-config-provider>
    </template>
  </Suspense>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
<style lang="scss"></style>
