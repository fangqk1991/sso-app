import { AdminUserCenter, UserProxy } from '../src'
import { loggerForDev } from '@fangcha/logger'
import * as assert from 'assert'
import { GlobalAppConfig } from 'fc-config'

describe('Test AdminUserCenter.test.ts', () => {
  AdminUserCenter.setUserProxy(new UserProxy(GlobalAppConfig.UserSDK.adminUserService))

  const checker = AdminUserCenter.checker()

  before(async () => {
    await AdminUserCenter.reloadAppInfo()
  })

  it(`getAppFullInfo`, async () => {
    const appInfo = await AdminUserCenter.appInfo()
    loggerForDev.info(appInfo)
  })

  it(`_permissionData`, async () => {
    loggerForDev.info(JSON.stringify(checker['_permissionData'], null, 2))
  })

  it(`_groupPermissionMapper`, async () => {
    loggerForDev.info(JSON.stringify(checker['_groupPermissionMapper'], null, 2))
  })

  it(`checkUserHasPermission`, async () => {
    assert.strictEqual(await checker.checkUserHasPermission('someone', '*'), false)
    assert.strictEqual(await checker.checkUserHasPermission('goddess', '*'), true)
  })

  it(`assertUserHasPermission - true`, async () => {
    await checker.assertUserHasPermission('goddess', '*')
  })

  it(`assertUserHasPermission - false`, async () => {
    try {
      await checker.assertUserHasPermission('someone', '*')
    } catch (e: any) {
      console.info(e.message)
    }
  })
})
