import { GlobalAppConfig } from 'fc-config'
import { FeishuClient } from '../../src'
import { CustomRequestFollower } from '@fangcha/backend-kit'

describe('Test FeishuClient.test.ts', () => {
  const feishuClient = new FeishuClient(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)

  it(`getUserToken`, async () => {
    const response = await feishuClient.getUserToken('00aqc829b9db41819ff8d5e81cfeb43b')
    console.info(response)
  })

  it(`getAllEmployees`, async () => {
    const items = await feishuClient.getAllEmployees({
      // view: 'full',
    })
    console.info(JSON.stringify(items, null, 2))
  })

  it(`getDepartmentAllMembers`, async () => {
    const items = await feishuClient.getDepartmentAllMembers('0')
    console.info(items)
  })

  it(`getDepartmentInfo`, async () => {
    const department = await feishuClient.getDepartmentInfo('0')
    console.info(department)
  })

  it(`getDepartmentChildren`, async () => {
    const children = await feishuClient.getDepartmentChildren('0')
    console.info(JSON.stringify(children, null, 2))
  })

  it(`fillDepartmentTree`, async () => {
    const rootNode = await feishuClient.getDepartmentTree('0')
    // console.info(rootNode)
    console.info(JSON.stringify(rootNode, null, 2))
  })
})
