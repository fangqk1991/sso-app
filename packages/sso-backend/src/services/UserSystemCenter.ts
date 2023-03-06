import assert from '@fangcha/assert'
import { MyPermissionServer } from './MyPermissionServer'
import { AppType, PermissionHelper } from '@fangcha/account-models'

class _UserSystemCenter {
  public async prepareUserSystemApp() {
    let app = await MyPermissionServer.findApp('user-system')
    if (!app) {
      app = await MyPermissionServer.generateApp({
        appid: 'user-system',
        name: 'User System',
        appType: AppType.Admin,
        remarks: '',
        configData: {},
        permissionMeta: PermissionHelper.defaultPermissionMeta(),
        powerUserList: [],
        author: 'user-system@fangcha.net',
      })
    }
    assert.ok(!!app, 'user-system 未被创建', 500)
    return app
  }
}

export const UserSystemCenter = new _UserSystemCenter()
