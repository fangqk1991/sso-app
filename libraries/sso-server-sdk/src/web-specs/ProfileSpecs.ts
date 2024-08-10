import { SpecFactory } from '@fangcha/router'
import { ProfileApis } from '@fangcha/sso-models'
import { SsoServer, SsoSession } from '@fangcha/sso-server'
import { AccountProfile, PasswordUpdateParams } from '@fangcha/account-models'
import assert from '@fangcha/assert'

const factory = new SpecFactory('Profile')

factory.prepare(ProfileApis.ProfileInfoGet, async (ctx) => {
  const session = ctx.session as SsoSession
  const account = await session.prepareAccountV2()
  const userInfo = await account.getVisitorCoreInfo()
  const profile: AccountProfile = {
    ...userInfo,
    nickName: account.nickName,
  }
  if (!account.password) {
    profile.emptyPassword = true
  }
  if (!userInfo.email || userInfo.email.match(/^\w{12}@wechat.qq$/)) {
    profile.emptyEmail = true
  }
  ctx.body = profile
})

factory.prepare(ProfileApis.ProfileInfoUpdate, async (ctx) => {
  const { nickName } = ctx.request.body
  // assert.ok(!!email, `email can not be empty`)
  assert.ok(!!nickName, `nickName can not be empty`)

  const session = ctx.session as SsoSession

  const account = await session.prepareAccountV2()
  account.fc_edit()
  account.nickName = nickName
  await account.updateToDB()

  // const ssoServer = ctx.ssoServer as SsoServer
  // await ssoServer.accountServer.updateEmail(account, email)
  await session.reloadAuthInfo(ctx)

  ctx.status = 200
})

factory.prepare(ProfileApis.EmailUpdate, async (ctx) => {
  const { email } = ctx.request.body
  assert.ok(!!email, `email can not be empty`)

  const session = ctx.session as SsoSession

  const account = await session.prepareAccountV2()

  const ssoServer = ctx.ssoServer as SsoServer
  await ssoServer.accountServer.updateEmail(account, email)
  await session.reloadAuthInfo(ctx)

  ctx.status = 200
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
