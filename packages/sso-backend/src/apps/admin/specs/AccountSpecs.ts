import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { AppException } from '@fangcha/app-error'
import { Admin_AccountApis } from '@web/sso-common/admin-api'
import { MyAccountServer } from '../../../services/MyAccountServer'
import { AccountErrorPhrase, CarrierType, ValidateUtils } from '@fangcha/account-models'
import { UserAdminUtils } from '../UserAdminUtils'
import { SimulateStorage } from '../../../services/storage/SimulateStorage'
import { FangchaSession } from '@fangcha/session'
import * as qs from 'query-string'
import { SsoConfig } from '../../../SsoConfig'
import { SimulateLoginApis } from '@web/sso-common/web-api'

const factory = new SpecFactory('Account')

factory.prepare(Admin_AccountApis.AccountPageDataGet, async (ctx) => {
  ctx.body = await MyAccountServer.FullAccount.getPageResult(ctx.request.query)
})

factory.prepare(Admin_AccountApis.AccountCreate, async (ctx) => {
  const fullParams = ValidateUtils.makePureEmailPasswordParams(ctx.request.body)
  const account = await MyAccountServer.createAccount(fullParams)
  ctx.body = account.modelForClient()
})

factory.prepare(Admin_AccountApis.AccountPasswordReset, async (ctx) => {
  const { newPassword } = ctx.request.body
  const accountUid = ctx.params.accountUid
  const account = await MyAccountServer.findAccount(accountUid)
  assert.ok(!!account, `Account[${accountUid}] not exists`)
  await MyAccountServer.updateAccountPassword(account, newPassword)
  ctx.status = 200
})

factory.prepare(Admin_AccountApis.AccountBasicInfoUpdate, async (ctx) => {
  const accountUid = ctx.params.accountUid
  const account = await MyAccountServer.findAccount(accountUid)
  assert.ok(!!account, `Account[${accountUid}] not exists`)
  await account.updateInfos(ctx.request.body)
  ctx.status = 200
})

factory.prepare(Admin_AccountApis.AccountCarrierListGet, async (ctx) => {
  const accountUid = ctx.params.accountUid
  const account = await MyAccountServer.findAccount(accountUid)
  assert.ok(!!account, `Account[${accountUid}] not exists`)
  const items = await account.getCarrierList()
  ctx.body = items.map((item) => item.modelForClient())
})

factory.prepare(Admin_AccountApis.AccountCarrierUpdate, async (ctx) => {
  const { carrierUid } = ctx.request.body
  if (!ValidateUtils.validateEmail(carrierUid)) {
    throw AppException.exception(AccountErrorPhrase.EmailIncorrect)
  }
  const accountUid = ctx.params.accountUid
  const account = await MyAccountServer.findAccount(accountUid)
  assert.ok(!!account, `Account[${accountUid}] not exists`)
  await account.updateCarrier(CarrierType.Email, carrierUid)
  ctx.status = 200
})

factory.prepare(Admin_AccountApis.AccountCarrierUnlink, async (ctx) => {
  const accountUid = ctx.params.accountUid
  const account = await MyAccountServer.findAccount(accountUid)
  assert.ok(!!account, `Account[${accountUid}] not exists`)
  const carrier = await account.findCarrier(CarrierType.Email)
  await carrier.deleteFromDB()
  ctx.status = 200
})

factory.prepare(Admin_AccountApis.AccountLoginSimulate, async (ctx) => {
  await UserAdminUtils.checkUserSystemAdmin(ctx)
  const session = ctx.session as FangchaSession

  const token = await SimulateStorage.makeSimulateToken({
    operator: session.curUserStr(),
    accountUid: ctx.params.accountUid,
  })
  const params = qs.stringify({
    token: token,
  })
  ctx.body = {
    url: `${SsoConfig.webBaseURL}${SimulateLoginApis.SimulateLogin.route}?${params}`,
  }
})

export const AccountSpecs = factory.buildSpecs()
