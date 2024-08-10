import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/session'
import { LoginService, SsoServer } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { CarrierType } from '@fangcha/account-models'
import { JointLoginApis } from '@fangcha/sso-models'
import { MyJointGoogle } from '../../../services/MyJointGoogle'
import { _FangchaState } from '@fangcha/backend-kit'

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

  const { redirectUri, accountUid } = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthCallback(ticket)

  const tokenData = await MyJointGoogle.getUserInfoFromAuthorizationCode(code)

  if (!accountUid) {
    let account = await accountServer.findAccountWithCarrier(CarrierType.Google, tokenData.sub)
    if (!account && tokenData.email) {
      const email = tokenData.email
      account = await accountServer.findAccountWithCarrier(CarrierType.Email, email)
      if (!account) {
        account = await accountServer.createAccount({
          email: email,
          password: '',
          nickName: tokenData.name || '',
          registerIp: session.realIP,
        })
        _FangchaState.botProxy.notify(`[Google] ${email} ${account.nickName} 注册了账号.`)
      }
      await account.updateCarrier(CarrierType.Google, tokenData.sub)
    }
  }

  await new LoginService(ctx).handleJointBindOrLogin({
    carrierType: CarrierType.Google,
    carrierUid: tokenData.sub,
    accountUid,
  })

  ctx.redirect(redirectUri)
})

export const GoogleLoginSpecs = factory.buildSpecs()
