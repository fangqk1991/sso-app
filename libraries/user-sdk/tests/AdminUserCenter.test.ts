import { AdminUserCenter, UserProxy } from '../src'
import { GlobalAppConfig } from 'fc-config'
import { AppFullInfo } from '@fangcha/account-models'
import * as assert from 'assert'
import { loggerForDev } from '@fangcha/logger'

describe('Test AdminUserCenter.test.ts', () => {
  AdminUserCenter.useAutoReloadingChecker(new UserProxy(GlobalAppConfig.UserSDK.adminUserService))

  // before(async () => {
  //   await AdminUserCenter.waitForReady()
  // })

  it(`concurrency`, async () => {
    const startTs = Date.now()
    const infoList: AppFullInfo[] = []
    await Promise.all(
      new Array(10).fill(null).map(() => {
        return AdminUserCenter.reloadAppInfo().then(() => {
          infoList.push(AdminUserCenter.appInfo())
          console.info(`elapsed: ${Date.now() - startTs}ms`)
        })
      })
    )
    for (let i = 1; i < infoList.length; ++i) {
      assert.ok(infoList[i] === infoList[0])
    }
    loggerForDev.info(JSON.stringify(infoList[0], null, 2))
  })
})
