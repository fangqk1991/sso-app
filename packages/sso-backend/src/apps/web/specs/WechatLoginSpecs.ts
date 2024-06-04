import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/session'
import { LoginService, SsoServer } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { CarrierType } from '@fangcha/account-models'
import { JointLoginApis } from '@fangcha/sso-models'
import { SsoConfig } from '../../../SsoConfig'
import { MyJointWechat } from '../../../services/MyJointWechat'
import { md5 } from '@fangcha/tools'

const factory = new SpecFactory('Wechat Login', { skipAuth: true })

factory.prepare(JointLoginApis.WechatLoginPrepare, async (ctx) => {
  const ssoServer = ctx.ssoServer as SsoServer
  const options = SsoConfig.JointLogin.Wechat
  const ticket = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthRequest({
    redirectUri: ctx.session.getRefererUrl(),
  })
  ctx.body = {
    appid: options.appid,
    redirectUri: options.redirectUri,
    state: ticket,
  }
})

factory.prepare(JointLoginApis.WechatCallback, async (ctx) => {
  const code = ctx.request.query.code as string
  const ticket = ctx.request.query.state as string

  assert.ok(!!code, `code missing error.`)
  assert.ok(!!ticket, `state missing error.`)

  const session = ctx.session as FangchaSession
  const ssoServer = ctx.ssoServer as SsoServer
  const accountServer = ssoServer.accountServer

  const userInfo = await MyJointWechat.getUserInfoFromAuthorizationCode(code)

  let account = await accountServer.findAccountWithCarrier(CarrierType.Wechat, userInfo.unionid)
  if (!account) {
    const email = md5(userInfo.unionid).substring(0, 12)
    account = await accountServer.findAccountWithCarrier(CarrierType.Email, email)
    if (!account) {
      account = await accountServer.createAccount({
        email: email,
        password: '',
        nickName: userInfo.nickname || '',
        registerIp: session.realIP,
      })
    }
    await account.updateCarrier(CarrierType.Wechat, userInfo.unionid)
  }
  await new LoginService(ctx).onLoginSuccess(account!)

  const { redirectUri } = await ssoServer.makeJointOAuthHandler(ctx).handleOAuthCallback(ticket)
  ctx.redirect(redirectUri)
})

export const WechatLoginSpecs = factory.buildSpecs()
