import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { AppException } from '@fangcha/app-error'
import { Admin_AccountApis } from '@web/sso-common/admin-api'
import { MyAccountServer } from '../../../services/MyAccountServer'
import { AccountErrorPhrase, CarrierType, ValidateUtils } from '@fangcha/account-models'

const factory = new SpecFactory('Account')

factory.prepare(Admin_AccountApis.AccountPageDataGet, async (ctx) => {
  ctx.body = await MyAccountServer.FullAccount.getPageResult(ctx.request.query)
})

factory.prepare(Admin_AccountApis.AccountCreate, async (ctx) => {
  const account = await MyAccountServer.createAccount(ctx.request.body)
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

export const AccountSpecs = factory.buildSpecs()
