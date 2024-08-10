import { SpecFactory } from '@fangcha/router'
import { SsoServer, SsoSession } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { CarrierTypeDescriptor } from '@fangcha/account-models'
import { JointBindApis } from '@fangcha/sso-models'
import { MyJointWechat, MyJointWechatMP } from '../../../services/MyJointWechat'

const factory = new SpecFactory('Joint Bind')

factory.prepare(JointBindApis.WechatLoginBindGoto, async (ctx) => {
  const session = ctx.session as SsoSession
  const ssoServer = ctx.ssoServer as SsoServer
  const account = await session.prepareAccountV2()
  const isOfficialMP = !!ctx.request.query['formMP']

  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    prefix: isOfficialMP ? 'MP' : undefined,
    redirectUri: ctx.session.getRefererUrl(),
    accountUid: account.accountUid,
  })
  const wechatProxy = isOfficialMP ? MyJointWechatMP : MyJointWechat
  ctx.redirect(wechatProxy.getAuthorizeUri(ticket))
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
