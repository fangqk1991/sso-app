import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { FeishuClient, FeishuServer, FeishuSync } from '../../src'

describe('Test FeishuSync.test.ts', () => {
  const feishuServer = new FeishuServer({
    database: new FCDatabase().init(new DBOptionsBuilder(GlobalAppConfig.FangchaAuth.mysql.ssoDB).build()),
  })
  const feishuClient = new FeishuClient(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)
  const feishuSync = new FeishuSync({
    feishuServer: feishuServer,
    feishuClient: feishuClient,
  })

  it(`fetchFullUserGroups`, async () => {
    await feishuSync.fetchFullUserGroups()

    const searcher = new feishuServer.FeishuUserGroup().fc_searcher()
    const items = await searcher.queryAllFeeds()
    for (const item of items) {
      console.info(JSON.stringify(item, null, 2))
    }
  })

  it(`fetchRemoteEmployees`, async () => {
    await feishuSync.fetchRemoteEmployees()
  })

  it(`fetchRemoteDepartmentsAndUsers`, async () => {
    await feishuSync.fetchRemoteDepartmentsAndUsers()
  })

  it(`syncRemoteDepartmentsAndUsers`, async () => {
    await feishuSync.syncRemoteDepartmentsAndUsers()
  })
})
