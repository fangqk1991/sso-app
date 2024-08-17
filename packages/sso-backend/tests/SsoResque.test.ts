import { WeixinMPSyncTask } from '../src/apps/resque/WeixinMPSyncTask'

describe('Test SsoResque.test.ts', () => {
  it(`WeixinMPSyncTask.perform`, async () => {
    await new WeixinMPSyncTask().perform()
  })
})
