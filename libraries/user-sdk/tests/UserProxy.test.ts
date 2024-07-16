import { UserProxy } from '../src'
import { loggerForDev } from '@fangcha/logger'
import { GlobalAppConfig } from 'fc-config'

describe('Test UserProxy.test.ts', () => {
  const userProxy = new UserProxy(GlobalAppConfig.UserSDK.adminUserService)

  it(`getAppFullInfo`, async () => {
    const infoData = await userProxy.getAppFullInfo()
    loggerForDev.info(infoData)
  })

  it(`getAppVersion`, async () => {
    loggerForDev.info(await userProxy.getAppVersion())
  })

  it(`searchStaffsByEmployeeIds`, async () => {
    loggerForDev.info(await userProxy.searchStaffsByEmployeeIds([]))
  })

  it(`getUserGroupMembers`, async () => {
    loggerForDev.info(await userProxy.getUserGroupMembers('111'))
  })

  it(`pushNotification`, async () => {
    await userProxy.pushNotification({
      openId: GlobalAppConfig.test_weixinMP.mpOpenid,
      templateId: GlobalAppConfig.test_weixinMP.mpTemplateId,
      params: {
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
