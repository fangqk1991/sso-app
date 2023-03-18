import { SpecFactory } from '@fangcha/router'
import { LoginApis } from '@fangcha/sso-models'
import { LoginService, SsoSession } from '@fangcha/sso-server'

const factory = new SpecFactory('Login')

factory.prepare(LoginApis.LoginWithEmail, async (ctx) => {
  await new LoginService(ctx).loginWithEmail(ctx.request.body)
  ctx.status = 200
})

factory.prepare(LoginApis.Logout, async (ctx) => {
  const session = ctx.session as SsoSession
  await session.logout(ctx)
  ctx.redirect((ctx.request.query.redirect_uri as string) || '/')
})

export const LoginSpecs = factory.buildSpecs()
