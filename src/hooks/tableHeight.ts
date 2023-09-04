// 计算el-table高度
export const useTableHeight = (isRole = false, noPager = false) => {
  // 内容区域容器
  const appRef = ref()
  // 表格高度
  const tableHeight = ref<number>(0)

  const getTableHeight = () => {
    const defaultPopoverDom = document.getElementById('defaultPopover')
    const defaultScrollDom = document.getElementById('scrollTab')
    const defaultViewTextHeight = defaultPopoverDom?.clientHeight || 0
    const defaultScrollTextHeight = defaultScrollDom?.clientHeight || 0
    // 页面容器高度
    const appRefHeight = appRef.value?.clientHeight
    // 查询条件容器高度 不需要了
    // const searchRefHeight = searchRef.value?.$el.clientHeight // 查询子组件高度获取方法加$el
    // 分页容器高度
    const pagerHeight = noPager ? 0 : 60
    const header = isRole ? 124 : 78
    tableHeight.value = appRefHeight - defaultViewTextHeight - defaultScrollTextHeight - header - pagerHeight
  }
  nextTick(() => {
    getTableHeight()
  })
  onUpdated(() => {
    getTableHeight()
  })
  window.onresize = () => {
    getTableHeight()
  }

  return {
    appRef,
    tableHeight,
    getTableHeight
  }
}
