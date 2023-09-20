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
})
