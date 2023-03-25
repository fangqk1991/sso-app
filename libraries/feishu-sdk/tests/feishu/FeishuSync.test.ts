import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { FeishuServer } from '@fangcha/account'
import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { FeishuClient, FeishuSync } from '../../src'

describe('Test FeishuSync.test.ts', () => {
  const feishuServer = new FeishuServer({
    database: new FCDatabase().init(new DBOptionsBuilder(GlobalAppConfig.FangchaAuth.mysql.ssoDB).build()),
  })
  const feishuClient = new FeishuClient(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)
  const feishuSync = new FeishuSync(feishuServer, feishuClient)

  it(`fetchRemoteDepartmentsAndUsers`, async () => {
    await feishuSync.fetchRemoteDepartmentsAndUsers()
  })
})
