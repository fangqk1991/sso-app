import { AdminUserCenter, UserProxy } from '../src'
import { GlobalAppConfig } from 'fc-config'
import { sleep } from '@fangcha/tools'

describe('Test AdminAppChecker.test.ts', () => {
  const checker = AdminUserCenter.useAutoReloadingChecker(new UserProxy(GlobalAppConfig.UserSDK.adminUserService))

  before(async () => {
    await AdminUserCenter.waitForReady()
  })

  it(`simulate`, async () => {
    const userName = 'Tim'
    const permissionKey = 'P_0'
    for (let i = 0; i < 600; ++i) {
      console.info(`${userName} has permission keys: `, checker.getPermissionKeysForUser(userName))
      console.info(
        `Check ${userName} has permission(${permissionKey})?`,
        checker.checkUserHasPermission(userName, permissionKey)
      )
      await sleep(1000)
    }
  })
})
