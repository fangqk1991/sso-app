import { OpenUserCenter, UserProxy } from '../src'
import { GlobalAppConfig } from 'fc-config'

describe('Test OpenAppChecker.test.ts', () => {
  const checker = OpenUserCenter.useAutoReloadingChecker(new UserProxy(GlobalAppConfig.UserSDK.openUserService))

  before(async () => {
    await OpenUserCenter.waitForReady()
  })

  it(`assertSessionValid`, async () => {
    checker.assertSessionValid('demo-app', 'KpzExYjgNoFyyR0hpVMc2ewcTOXzaKam')
  })
})
