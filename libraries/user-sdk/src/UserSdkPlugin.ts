import { _FangchaState, AppPluginProtocol, CustomRequestFollower } from '@fangcha/backend-kit'
import { BasicAuthConfig } from '@fangcha/tools'
import { AdminUserCenter } from './admin/AdminUserCenter'
import { UserProxy } from './core/UserProxy'

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
    },
  }
}
