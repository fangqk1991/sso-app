import { GlobalAppConfig } from 'fc-config'
import { FeishuClient } from '../../src'
import { CustomRequestFollower } from '@fangcha/backend-kit'

describe('Test FeishuClient.test.ts', () => {
  const feishuClient = new FeishuClient(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)

  it(`getEmployeePageData`, async () => {
    const pageData = await feishuClient.getEmployeePageData()
    console.info(JSON.stringify(pageData, null, 2))
  })

  it(`getAllEmployees`, async () => {
    const items = await feishuClient.getAllEmployees()
    console.info(JSON.stringify(items, null, 2))
  })
})
