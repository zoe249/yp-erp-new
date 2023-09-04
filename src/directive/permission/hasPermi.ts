import { Directive } from 'vue'
import router from '@/router/index'
export const permission: Directive = {
  mounted(el, binding) {
    const action = binding.value.action
    const effect = binding.value.effect
    // console.log('router.currentRoute.value.permission', router.currentRoute.value.meta.rights)
    const rights = router.currentRoute.value.meta.rights as any[]
    if (!rights.length) return
    const hasPermission = rights.some((item: any) => {
      return item.meta.permissionKey.includes(action)
    })

    // 如果没有权限，则隐藏按钮/移除按钮
    if (!hasPermission) {
      el.style.display = 'none'
    } else {
      // 如果有权限，看是否需要disabeld
      if (effect === 'disabled') {
        el.disabled = true
        el.classList.add('is-disabled')
      }
    }
  }
}
