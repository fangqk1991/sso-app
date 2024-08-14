import { SpecFactory } from '@fangcha/router'
import { SsoServer, SsoSession } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { CarrierTypeDescriptor } from '@fangcha/account-models'
import { JointBindApis, JointLoginApis } from '@fangcha/sso-models'
import { MyJointWechat, MyJointWechatMP } from '../../../services/MyJointWechat'
import { MyFeishuSdkClient } from '../../../services/MyFeishuSdkClient'
import { _SessionApp } from '@fangcha/session'
import { MyJointGoogle } from '../../../services/MyJointGoogle'

const factory = new SpecFactory('Joint Bind')

factory.prepare(JointBindApis.GoogleLoginBindGoto, async (ctx) => {
  const session = ctx.session as SsoSession
  const ssoServer = ctx.ssoServer as SsoServer
  const account = await session.prepareAccountV2()

  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    redirectUri: ctx.session.getRefererUrl(),
    accountUid: account.accountUid,
  })
  ctx.redirect(MyJointGoogle.getAuthorizeUri(ticket))
})

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
  ctx.redirect(isOfficialMP ? MyJointWechatMP.mp_getAuthorizeUri(ticket) : MyJointWechat.getAuthorizeUri(ticket))
})

factory.prepare(JointBindApis.FeishuLoginBindGoto, async (ctx) => {
  const session = ctx.session as SsoSession
  const ssoServer = ctx.ssoServer as SsoServer
  const account = await session.prepareAccountV2()

  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    redirectUri: ctx.session.getRefererUrl(),
    accountUid: account.accountUid,
  })

  ctx.redirect(
    MyFeishuSdkClient.makeAuthorizeUri({
      redirectUri: `${_SessionApp.getBaseURL(ctx.host)}${JointLoginApis.FeishuCallback.route}`,
      state: ticket,
    })
  )
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
