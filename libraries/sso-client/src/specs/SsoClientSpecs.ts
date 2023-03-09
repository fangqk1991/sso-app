import assert from '@fangcha/assert'
import * as jsonwebtoken from 'jsonwebtoken'
import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { FangchaSession } from '@fangcha/router/lib/session'
import { SsoClientApis } from '@fangcha/sso-models'
import { _SsoState } from '../core/_SsoState'

const factory = new SpecFactory('SSO', { skipAuth: true })

factory.prepare(SsoClientApis.Login, async (ctx) => {
  const session = ctx.session as FangchaSession
  const ssoProxy = _SsoState.makeOAuthClient(ctx)
  ctx.redirect(ssoProxy.getAuthorizeUri(session.getRefererUrl()))
})

factory.prepare(SsoClientApis.Logout, async (ctx) => {
  ctx.cookies.set(_SsoState.jwtProtocol.jwtKey, '', {
    maxAge: 0,
  })
  const session = ctx.session as FangchaSession
  const ssoProxy = _SsoState.makeOAuthClient(ctx)
  ctx.redirect(ssoProxy.buildLogoutUrl(session.getRefererUrl()))
})

factory.prepare(SsoClientApis.SSOHandle, async (ctx) => {
  const { code, state: redirectUri } = ctx.request.query
  assert.ok(!!code && typeof code === 'string', 'code invalid.')
  assert.ok(typeof redirectUri === 'string', 'state/redirectUri invalid')
  const ssoProxy = _SsoState.makeOAuthClient(ctx)
  const accessToken = await ssoProxy.getAccessTokenFromCode(code as string)
  const userInfo = await _SsoState.ssoProtocol.getUserInfo(accessToken)
  const aliveSeconds = 24 * 3600
  const jwt = jsonwebtoken.sign(userInfo, _SsoState.jwtProtocol.jwtSecret, { expiresIn: aliveSeconds })
  ctx.cookies.set(_SsoState.jwtProtocol.jwtKey, jwt, { maxAge: aliveSeconds * 1000 })
  const session = ctx.session as FangchaSession
  ctx.redirect(session.correctUrl(redirectUri as string))
})

export const WebSsoSpecs = factory.buildSpecs()

export const SsoSpecDocItem: SwaggerDocItem = {
  name: 'SSO',
  pageURL: '/api-docs/v1/sso-sdk',
  specs: WebSsoSpecs,
}
