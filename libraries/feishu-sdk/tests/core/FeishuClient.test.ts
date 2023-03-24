import { GlobalAppConfig } from 'fc-config'
import { FeishuClient } from '../../src'
import { CustomRequestFollower } from '@fangcha/backend-kit'

describe('Test FeishuClient.test.ts', () => {
  const feishuClient = new FeishuClient(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)

  it(`getEmployeePageData`, async () => {
    const pageData = await feishuClient.getEmployeePageData({
      // user_id_type: ''
    })
    console.info(JSON.stringify(pageData, null, 2))
  })

  it(`getAllEmployees`, async () => {
    const items = await feishuClient.getAllEmployees({
      // user_id_type: 'union_id',
    })
    console.info(JSON.stringify(items, null, 2))
  })

  it(`getDepartmentMemberPageData`, async () => {
    const pageData = await feishuClient.getDepartmentMemberPageData('0')
    console.info(pageData)
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
