import assert from '@fangcha/assert'
import { MyPermissionServer } from './MyPermissionServer'

class _UserSystemCenter {
  public async prepareUserSystemApp() {
    const app = await MyPermissionServer.findApp('user-system')
    assert.ok(!!app, 'user-system 未被创建', 500)
    return app
  }
}

export const UserSystemCenter = new _UserSystemCenter()
