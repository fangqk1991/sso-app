import { SpecFactory } from '@fangcha/router'
import { LoginService, SsoServer } from '@fangcha/sso-server'
import assert from '@fangcha/assert'
import { SimulateLoginApis } from '@web/sso-common/web-api'
import { SimulateStorage } from '../../../services/storage/SimulateStorage'

const factory = new SpecFactory('Simulate Login', { skipAuth: true })

factory.prepare(SimulateLoginApis.SimulateLogin, async (ctx) => {
  const token = ctx.request.query.token as string
  assert.ok(!!token, `Token missing.`)
  const params = (await SimulateStorage.getSimulateParams(token))!
  assert.ok(!!params, `Token expired.`)
  const ssoServer = ctx.ssoServer as SsoServer
  const account = await ssoServer.accountServer.findAccount(params.accountUid)
  await new LoginService(ctx).onLoginSuccess(account)
  await SimulateStorage.clearSimulateParams(token)
  ctx.redirect('/profile')
})

export const SimulateLoginSpecs = factory.buildSpecs()
