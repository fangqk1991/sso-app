import { CustomRequestFollower } from '@fangcha/backend-kit'
import { GlobalAppConfig } from 'fc-config'
import { WeixinMpProxy } from '../src/core/WeixinMpProxy'

const mpProxy = new WeixinMpProxy(GlobalAppConfig.FangchaAuth.JointLogin.WechatMP, CustomRequestFollower)

describe('Test WeixinMpProxy.test.ts', () => {
  it(`getUserPageData`, async () => {
    const pageData = await mpProxy.getUserPageData()
    console.info(pageData)
  })

  it(`getOpenIdList`, async () => {
    const openIdList = await mpProxy.getOpenIdList()
    console.info(openIdList)
  })

  it(`getUserInfo`, async () => {
    const openIdList = await mpProxy.getOpenIdList()
    const userInfo = await mpProxy.getUserInfo(openIdList[0])
    console.info(userInfo)
  })

  it(`getUserInfosBatch`, async () => {
    const openIdList = await mpProxy.getOpenIdList()
    const userList = await mpProxy.getUserInfosBatch(openIdList)
    console.info(userList)
  })
})
