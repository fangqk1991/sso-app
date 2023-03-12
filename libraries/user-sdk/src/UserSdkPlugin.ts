import { _FangchaState, AppPluginProtocol, CustomRequestFollower } from '@fangcha/backend-kit'
import { BasicAuthConfig } from '@fangcha/tools'
import { AdminUserCenter } from './admin/AdminUserCenter'
import { UserProxy } from './core/UserProxy'
import { _SessionApp } from '@fangcha/session'
import { UserSdkSpecDocItem } from './specs/UserSdkSpecs'

export const UserSdkPlugin = (config: BasicAuthConfig): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      const userProxy = new UserProxy(config, CustomRequestFollower)
      AdminUserCenter.useAutoReloadingChecker(userProxy)
      await AdminUserCenter.waitForReady()
      _FangchaState.addUserInfoTransfer(async (userInfo: { email: string }) => {
        return {
          ...userInfo,
          isAdmin: AdminUserCenter.checker().checkUserIsAdmin(userInfo.email),
          permissionKeyMap: AdminUserCenter.checker().getPermissionKeyMapForUser(userInfo.email),
        }
      })
      _SessionApp.setPermissionProtocol({
        checkUserIsAdmin: (email) => {
          return AdminUserCenter.checker().checkUserIsAdmin(email)
        },
        checkUserHasPermission: (email, permissionKey) => {
          return AdminUserCenter.checker().checkUserHasPermission(email, permissionKey)
        },
        checkUserInAnyGroup: (email, ...groupIds) => {
          return AdminUserCenter.checker().checkUserInAnyGroup(email, ...groupIds)
        },
      })
    },
    specDocItems: [UserSdkSpecDocItem],
  }
}
