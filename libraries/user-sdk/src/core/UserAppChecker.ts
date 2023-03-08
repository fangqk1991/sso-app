import { AppFullInfo, PermissionHelper, PermissionMeta } from '@fangcha/account-models'

interface GroupPermissionMapper {
  [groupId: string]: {
    [permissionKey: string]: true
  }
}

export class AppPermissionHelper {
  public static buildRealPermissionKeyMap(permissionMeta: PermissionMeta, permissionKeys: string[]) {
    const result: { [p: string]: true } = permissionKeys.reduce((result, cur) => {
      result[cur] = true
      return result
    }, {})
    const fillSubTree = (meta: PermissionMeta) => {
      if (result[meta.permissionKey] && meta.children) {
        meta.children.forEach((child) => {
          result[child.permissionKey] = true
          fillSubTree(child)
        })
      }
    }
    const searchTree = (meta: PermissionMeta) => {
      if (result[meta.permissionKey]) {
        fillSubTree(meta)
        return true
      }
      if (meta.children && meta.children.length > 0) {
        let hasFullSubKeys = true
        meta.children.forEach((child) => {
          if (!searchTree(child)) {
            hasFullSubKeys = false
          }
        })
        if (hasFullSubKeys) {
          result[meta.permissionKey] = true
          return true
        }
      }
      return false
    }
    searchTree(permissionMeta)
    return result
  }
}

export class UserAppChecker {
  protected _appInfo!: AppFullInfo
  protected _permissionData: { [p: string]: PermissionMeta } = {}
  protected _groupPermissionMapper: GroupPermissionMapper = {}

  public constructor() {}

  public appInfo() {
    return this._appInfo
  }

  public setAppInfo(appInfo: AppFullInfo) {
    const permissionList = PermissionHelper.flattenPermissionMeta(appInfo.permissionMeta)
    this._permissionData = permissionList.reduce((result, cur) => {
      result[cur.permissionKey] = cur
      return result
    }, {})
    this._appInfo = appInfo
    {
      const groupPermissionMapper: GroupPermissionMapper = {}
      for (const group of appInfo.groups) {
        groupPermissionMapper[group.groupId] = AppPermissionHelper.buildRealPermissionKeyMap(
          appInfo.permissionMeta,
          group.permissionKeys
        )
      }
      this._groupPermissionMapper = groupPermissionMapper
    }
  }
}
