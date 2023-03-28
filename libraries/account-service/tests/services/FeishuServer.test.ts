import { FeishuServer } from '../../src'
import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { GlobalAppConfig } from 'fc-config'

describe('Test FeishuServer.test.ts', () => {
  const feishuServer = new FeishuServer({
    database: new FCDatabase().init(new DBOptionsBuilder(GlobalAppConfig.FangchaAuth.mysql.ssoDB).build()),
  })

  it(`getFullStructureInfo`, async () => {
    const structure = await feishuServer.getFullStructureInfo()
    console.info(structure)
  })
})
