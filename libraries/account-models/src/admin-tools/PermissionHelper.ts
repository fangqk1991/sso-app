import assert from '@fangcha/assert'
import { PermissionMeta } from '../admin/PermissionModels'

export class PermissionHelper {
  public static defaultPermissionMeta(): PermissionMeta {
    return {
      permissionKey: '*',
      name: '所有权限',
      description: '所有权限',
      children: [],
    }
  }

  public static checkPermissionMeta(permissionMeta: PermissionMeta) {
    const handler = (meta: PermissionMeta) => {
      assert.ok(!!meta.permissionKey, 'PermissionMeta.permissionKey 不能为空')
      // assert.ok(!meta.permissionKey.includes('.'), 'PermissionMeta.permissionKey 不能包含特殊字符 .')
      assert.ok(!!meta.name, 'PermissionMeta.name 不能为空')
      if (meta.children) {
        assert.ok(Array.isArray(meta.children), 'PermissionMeta.children 格式有误')
        meta.children.forEach((child) => {
          handler(child)
        })
      }
    }
    handler(permissionMeta)
    const flatPermissionList = this.flattenPermissionMeta(permissionMeta)
    const markedData: { [p: string]: true } = {}
    for (const item of flatPermissionList) {
      assert.ok(!markedData[item.permissionKey], `permissionKey(${item.permissionKey}) 存在重复`)
      markedData[item.permissionKey] = true
    }
  }

  public static flattenPermissionMeta(meta: PermissionMeta) {
    let flatPermissionList: PermissionMeta[] = [meta]
    if (meta.children) {
      meta.children.forEach((child) => {
        flatPermissionList = flatPermissionList.concat(this.flattenPermissionMeta(child))
      })
    }
    return flatPermissionList
  }
}
