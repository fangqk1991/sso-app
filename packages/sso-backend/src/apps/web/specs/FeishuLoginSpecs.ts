import { SpecFactory } from '@fangcha/router'
import { _SessionApp, FangchaSession } from '@fangcha/session'
import { MyFeishuSdkClient } from '../../../services/MyFeishuSdkClient'
import { LoginService, SsoServer } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { GlobalAppConfig } from 'fc-config'
import { makeRandomStr } from '@fangcha/tools'
import { CarrierType } from '@fangcha/account-models'
import { JointLoginApis } from '@fangcha/sso-models'

const factory = new SpecFactory('Feishu Login', { skipAuth: true })

if (GlobalAppConfig.Env !== 'production') {
  factory.prepare(JointLoginApis.FeishuLoginForCode, async (ctx) => {
    const ssoServer = ctx.ssoServer as SsoServer
    const session = ctx.session as FangchaSession
    const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
      redirectUri: session.getRefererUrl(),
    })
    ctx.redirect(
      MyFeishuSdkClient.makeAuthorizeUri({
        redirectUri: `${_SessionApp.getBaseURL(ctx.host)}${JointLoginApis.FeishuCallbackForCode.route}`,
        state: ticket,
      })
    )
  })

  factory.prepare(JointLoginApis.FeishuCallbackForCode, async (ctx) => {
    const code = ctx.request.query.code as string
    const ticket = ctx.request.query.state as string

    assert.ok(!!code, `code missing error.`)
    assert.ok(!!ticket, `state missing error.`)

    const tokenData = await MyFeishuSdkClient.getUserToken(code)

    const ssoServer = ctx.ssoServer as SsoServer
    const { redirectUri } = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthCallback(ticket as string)
    ctx.body = {
      ...tokenData,
      redirectUri: redirectUri,
    }
  })
}

factory.prepare(JointLoginApis.FeishuLogin, async (ctx) => {
  const ssoServer = ctx.ssoServer as SsoServer
  const session = ctx.session as FangchaSession
  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    redirectUri: session.getRefererUrl(),
  })
  ctx.redirect(
    MyFeishuSdkClient.makeAuthorizeUri({
      redirectUri: `${_SessionApp.getBaseURL(ctx.host)}${JointLoginApis.FeishuCallback.route}`,
      state: ticket,
    })
  )
})

factory.prepare(JointLoginApis.FeishuCallback, async (ctx) => {
  const code = ctx.request.query.code as string
  const ticket = ctx.request.query.state as string

  assert.ok(!!code, `code missing error.`)
  assert.ok(!!ticket, `state missing error.`)

  const session = ctx.session as FangchaSession
  const ssoServer = ctx.ssoServer as SsoServer
  const accountServer = ssoServer.accountServer

  const tokenData = await MyFeishuSdkClient.getUserToken(code)

  let account = await accountServer.findAccountWithCarrier(CarrierType.Feishu, tokenData.union_id)
  if (!account) {
    const email = tokenData.enterprise_email || `${tokenData.union_id}@email.com`
    account = await accountServer.findAccountWithCarrier(CarrierType.Email, email)
    if (!account) {
      account = await accountServer.createAccount({
        email: email,
        password: makeRandomStr(16),
        nickName: tokenData.name || tokenData.en_name || '',
        registerIp: session.realIP,
      })
    }
    await account.updateCarrier(CarrierType.Feishu, tokenData.union_id)
  }
  await new LoginService(ctx).onLoginSuccess(account)

  const { redirectUri } = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthCallback(ticket as string)
  ctx.redirect(redirectUri)
})

export const FeishuLoginSpecs = factory.buildSpecs()
