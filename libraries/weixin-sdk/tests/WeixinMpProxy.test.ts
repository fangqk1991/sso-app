import { CustomRequestFollower } from '@fangcha/backend-kit'
import { GlobalAppConfig } from 'fc-config'
import { WeixinMpProxy } from '../src/official-mp/WeixinMpProxy'

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

  it(`getIndustryInfo`, async () => {
    const response = await mpProxy.getIndustryInfo()
    console.info(response)
  })

  it(`getAllTemplates`, async () => {
    const response = await mpProxy.getAllTemplates()
    console.info(response)
  })

  it(`sendTemplateMessage`, async () => {
    await mpProxy.sendTemplateMessage({
      touser: GlobalAppConfig.test_weixinMP.mpOpenid,
      template_id: GlobalAppConfig.test_weixinMP.mpTemplateId,
      data: {
        // keyword1: {
        //   value: '巧克力',
        // },
        // keyword2: {
        //   value: '39.8元',
        // },
        // keyword3: {
        //   value: '2014年9月22日',
        // },
      },
    })
  })
})
