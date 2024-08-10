import { SpecFactory } from '@fangcha/router'
import { SsoServer, SsoSession } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { CarrierTypeDescriptor } from '@fangcha/account-models'
import { JointBindApis } from '@fangcha/sso-models'
import { SsoConfig } from '../../../SsoConfig'

const factory = new SpecFactory('Joint Bind')

factory.prepare(JointBindApis.WechatLoginBindPrepare, async (ctx) => {
  const session = ctx.session as SsoSession
  const ssoServer = ctx.ssoServer as SsoServer
  const options = SsoConfig.JointLogin.Wechat
  const account = await session.prepareAccountV2()

  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    redirectUri: ctx.session.getRefererUrl(),
    accountUid: account.accountUid,
  })
  ctx.body = {
    appid: options.appid,
    redirectUri: options.redirectUri,
    state: ticket,
  }
})

factory.prepare(JointBindApis.JointLoginUnlink, async (ctx) => {
  const carrierType = ctx.params.carrierType
  assert.ok(CarrierTypeDescriptor.checkValueValid(carrierType), `CarrierType Error`)
  const session = ctx.session as SsoSession
  const account = await session.prepareAccountV2()
  const carrier = await account.findCarrier(carrierType)
  await carrier.deleteFromDB()
  ctx.status = 200
})

export const JointBindSpecs = factory.buildSpecs()
