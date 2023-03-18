import { SpecFactory } from '@fangcha/router'
import { ProfileApis } from '@fangcha/sso-models'
import { SsoServer, SsoSession } from '@fangcha/sso-server'
import { PasswordUpdateParams } from '@fangcha/account-models'
import assert from '@fangcha/assert'

const factory = new SpecFactory('Profile')

factory.prepare(ProfileApis.ProfileInfoGet, async (ctx) => {
  const session = ctx.session as SsoSession
  ctx.body = session.getAuthInfo()
})

factory.prepare(ProfileApis.PasswordUpdate, async (ctx) => {
  const params = ctx.request.body as PasswordUpdateParams
  assert.ok(!!params.newPassword, `newPassword can not be empty`)

  const session = ctx.session as SsoSession

  const accountV2 = await session.prepareAccountV2()
  accountV2.assertPasswordCorrect(params.curPassword)

  const ssoServer = ctx.ssoServer as SsoServer
  await ssoServer.accountServer.updateAccountPassword(accountV2, params.newPassword)

  await session.logout(ctx)
  ctx.status = 200
})

export const ProfileSpecs = factory.buildSpecs()
