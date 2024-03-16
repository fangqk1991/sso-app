import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/session'
import { LoginService, SsoServer } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { makeRandomStr } from '@fangcha/tools'
import { CarrierType } from '@fangcha/account-models'
import { JointLoginApis } from '@fangcha/sso-models'
import { MyJointGoogle } from '../../../services/MyJointGoogle'

const factory = new SpecFactory('Google Login', { skipAuth: true })

factory.prepare(JointLoginApis.GoogleLogin, async (ctx) => {
  const ssoServer = ctx.ssoServer as SsoServer
  const session = ctx.session as FangchaSession
  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    redirectUri: session.getRefererUrl(),
  })
  ctx.redirect(MyJointGoogle.getAuthorizeUri(ticket))
})

factory.prepare(JointLoginApis.GoogleCallback, async (ctx) => {
  const code = ctx.request.query.code as string
  const ticket = ctx.request.query.state as string

  assert.ok(!!code, `code missing error.`)
  assert.ok(!!ticket, `state missing error.`)

  const session = ctx.session as FangchaSession
  const ssoServer = ctx.ssoServer as SsoServer
  const accountServer = ssoServer.accountServer

  const tokenData = await MyJointGoogle.getUserInfoFromAuthorizationCode(code)

  let account = await accountServer.findAccountWithCarrier(CarrierType.Google, tokenData.sub)
  if (!account && tokenData.email) {
    const email = tokenData.email
    account = await accountServer.findAccountWithCarrier(CarrierType.Email, email)
    if (!account) {
      account = await accountServer.createAccount({
        email: email,
        password: makeRandomStr(16),
        nickName: tokenData.name || '',
        registerIp: session.realIP,
      })
    }
    await account.updateCarrier(CarrierType.Google, tokenData.sub)
  }
  await new LoginService(ctx).onLoginSuccess(account!)

  const { redirectUri } = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthCallback(ticket)
  ctx.redirect(redirectUri)
})

export const GoogleLoginSpecs = factory.buildSpecs()
