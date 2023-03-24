import { loggerForDev } from '@fangcha/logger'
import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { FeishuTokenKeeper } from '../../src/core/FeishuTokenKeeper'

describe('Test FeishuTokenKeeper.test.ts', () => {
  const keeper = new FeishuTokenKeeper(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)

  it(`requireTenantAccessToken`, async () => {
    const accessToken = await keeper.requireTenantAccessToken()
    loggerForDev.info(accessToken)
  })

  it(`Concurrency requireTenantAccessToken`, async () => {
    const resultList = await Promise.all(
      new Array(100).fill(1).map(() => {
        return keeper.requireTenantAccessToken()
      })
    )
    loggerForDev.info(resultList)
  })
})
