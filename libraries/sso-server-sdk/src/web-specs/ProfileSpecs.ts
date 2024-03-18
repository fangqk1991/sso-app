import { SpecFactory } from '@fangcha/router'
import { ProfileApis } from '@fangcha/sso-models'
import { SsoServer, SsoSession } from '@fangcha/sso-server'
import { AccountProfile, PasswordUpdateParams } from '@fangcha/account-models'
import assert from '@fangcha/assert'

const factory = new SpecFactory('Profile')

factory.prepare(ProfileApis.ProfileInfoGet, async (ctx) => {
  const session = ctx.session as SsoSession
  const account = await session.prepareAccountV2()
  const profile: AccountProfile = {
    ...session.getAuthInfo(),
    nickName: account.nickName,
  }
  if (!account.password) {
    profile.emptyPassword = true
  }
  ctx.body = profile
})

factory.prepare(ProfileApis.PasswordUpdate, async (ctx) => {
  const params = ctx.request.body as PasswordUpdateParams
  assert.ok(!!params.newPassword, `newPassword can not be empty`)

  const session = ctx.session as SsoSession

  const accountV2 = await session.prepareAccountV2()
  if (accountV2.password) {
    accountV2.assertPasswordCorrect(params.curPassword)
  }

  const ssoServer = ctx.ssoServer as SsoServer
  await ssoServer.accountServer.updateAccountPassword(accountV2, params.newPassword)

  await session.logout(ctx)
  ctx.status = 200
})

export const ProfileSpecs = factory.buildSpecs()
