import { SpecFactory } from '@fangcha/router'
import { SignupApis } from '@fangcha/sso-models'
import assert from '@fangcha/assert'
import { _FangchaState } from '@fangcha/backend-kit'
import { LoginService, SsoServer, SsoSession } from '@fangcha/sso-server'
import { ValidateUtils } from '@fangcha/account-models'

const factory = new SpecFactory('Signup')

factory.prepare(SignupApis.SimpleSignup, async (ctx) => {
  assert.ok(_FangchaState.frontendConfig.signupAble, '注册功能已被关闭')
  const session = ctx.session as SsoSession
  const ssoServer = ctx.ssoServer as SsoServer
  const fullParams = ValidateUtils.makePureEmailPasswordParams({
    ...ctx.request.body,
    registerIp: session.realIP,
  })
  const account = await ssoServer.accountServer.createAccount(fullParams)
  await new LoginService(ctx).onLoginSuccess(account)
  const email = session.getAuthInfo().email
  _FangchaState.botProxy.notify(`${email} 注册了账号.`)
  ctx.status = 200
})

export const SignupSpecs = factory.buildSpecs()
