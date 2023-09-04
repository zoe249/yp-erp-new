export const useMenuTree = (state: any, treeRef: any, menuTree: any, rowId: string) => {
  const disabledMenus = (permission: string, disable: boolean) => {
    let selectMenu: unknown | any
    const filterMenu = (menuTree: any, key: string) => {
      menuTree.map((item: any) => {
        if (item.permissionKey === key) {
          selectMenu = item
        } else {
          filterMenu(item.permissions, key)
        }

        return item
      })
    }
    filterMenu(state.permissionMenu, permission)

    const disabledMenu = (children: any) => {
      return children.permissions.map((item: any) => {
        if (item.permissions && item.permissions.length > 0) {
          for (let i = 0; i < item.permissions.length; i++) {
            item.permissions[i].disabled = disable
          }
        }
        item.disabled = disable
        return item
      })
    }
    selectMenu = disabledMenu(selectMenu)

    // menuTree.value![0].permissions[0].permissions = selectMenu

    const recursionMenu = (menus: Array<any>) => {
      menus.forEach((menu) => {
        if (menu.permissions && menu.permissions.length > 0) {
          recursionMenu(menu.permissions)
          treeRef.value?.setChecked(menu, false, false)
        } else {
          treeRef.value?.setChecked(menu, false, false)
        }
      })
    }
    if (!disable) {
      recursionMenu(selectMenu)
    }
  }

  const handleTree = (data: any, node: any) => {
    // 刪除键值
    const removeKey = (data: any) => {
      const index = state.formData.permissionKeys.indexOf(data.permissionKey)
      state.formData.permissionKeys.splice(index, index + 1)
    }
    const menus = treeRef.value?.getCheckedKeys()
    if (menus!.indexOf(data.permissionKey) > -1) {
      // 选中
      state.formData.permissionKeys.push(data.permissionKey)
      if (data.permissions && data.permissions.length > 0) {
        disabledMenus(data.permissionKey, true)
        filterMenu(data.permissions, state.formData.permissionKeys) // 过滤子级的键值
      }
    } else {
      // 取消选择
      // console.log('取消', data.permissionKey)
      removeKey(data)
      cancelSelect(data)
      if (data.permissions && data.permissions.length > 0) {
        disabledMenus(data.permissionKey, false)
      }
      // 特殊处理最外层 清空键值
      if (data.type === '01') {
        state.formData.permissionKeys = []
      }
    }
    function cancelSelect(data: any) {
      if (data.permissions.length > 0) {
        data.permissions.forEach((item: any) => {
          if (item.permissions.length > 0) {
            cancelSelect(item)
          } else {
            removeKey(item)
          }
        })
      }
    }
  }

  const filterMenu = (menu: any, menuKeys: any) => {
    // 集成被选中的项
    const keys: Array<string> = []
    const filter = (menus: any, key: any) => {
      menus.forEach((menu: any) => {
        if (menu.permissionKey === key) {
          keys.push(menu.permissionKey)
        } else {
          if (menu.permissions.length > 0) {
            filter(menu.permissions, key)
          } else {
            return
          }
        }
      })
    }
    menuKeys.forEach((key: any) => {
      filter(menu, key)
    })

    // 过滤重复的子级
    const menuKsyList = state.formData.permissionKeys.map((item: any, index: any) => {
      keys.forEach((key) => {
        if (key === item) {
          item = undefined
        }
      })
      return item
    })
    state.formData.permissionKeys = menuKsyList.filter((key: any) => {
      if (key) {
        return key
      }
    })
  }

  // 选择应用系统，切换功能菜单
  const handleSystem = async (systemCode: string) => {
    state.systemOptions.forEach((item: any) => {
      if (item.code === systemCode) {
        state.companyCode = item.companyCode
      }
    })
    state.permissionMenu = []
    const treeRes = await menuTree({ checkButton: false, systemCode })
    state.permissionMenu = treeRes.data as any
  }

  // 获取用户菜单并默认选择
  const getMenuTree = async (systemCode: string, permissionKey: Array<any>) => {
    const menuRes = await menuTree({ checkButton: false, systemCode: systemCode })
    state.permissionMenu = menuRes.data
    if (rowId) {
      state.permissionMenu = disabledMenu(menuRes.data)
      nextTick(() => {
        treeRef.value?.setCheckedKeys(state.formData.permissionKeys, false)
        defaultCheck(state.permissionMenu, permissionKey)
      })
    }

    // 禁用所有的子节点
    function defaultCheck(menuTree: any, menu: Array<any>) {
      menuTree.forEach((item: any) => {
        if (item.permissionKey === menu) {
          checkChild(item.permissions, menu)
        } else {
          defaultCheck(item.permissions, menu)
        }
      })

      function checkChild(menus: any, menu: Array<any>) {
        if (menus.length > 0) {
          menus.forEach((item: any) => {
            if (item.permissions.length > 0) {
              checkChild(item.permissions, menu)
            } else {
              treeRef.value?.setChecked(item, true, true)
            }
          })
        }
      }
    }
  }

  // 查看详情禁用菜单树
  const disabledMenu = (menus: any) => {
    return menus.map((item: any) => {
      item.disabled = true
      if (item.permissions && item.permissions.length) {
        item.disabled = true
        disabledMenu(item.permissions)
      } else {
        item.disabled = true
      }
      return item
    })
  }

  return { handleTree, handleSystem, getMenuTree }
}
