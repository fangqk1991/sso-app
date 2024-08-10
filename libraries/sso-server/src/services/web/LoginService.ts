import { Context } from 'koa'
import { SsoSession } from './SsoSession'
import { _Account } from '@fangcha/account'
import { AccountErrorPhrase, AccountSimpleParams, CarrierType } from '@fangcha/account-models'
import { AppException } from '@fangcha/app-error'
import { SsoServer } from '../../SsoServer'
import assert from '@fangcha/assert'

export class LoginService {
  public readonly ctx: Context

  constructor(ctx: Context) {
    this.ctx = ctx
  }

  public async onLoginSuccess(accountV2: _Account) {
    if (!accountV2.isEnabled) {
      throw AppException.exception(AccountErrorPhrase.AccountHasBeenBlocked)
    }
    const ctx = this.ctx
    const session = ctx.session as SsoSession
    const coreInfo = await accountV2.getVisitorCoreInfo()
    await session.login(coreInfo, ctx)
    ctx.status = 200
  }

  public async loginWithEmail(params: AccountSimpleParams) {
    const ssoServer = this.ctx.ssoServer as SsoServer
    const carrier = await ssoServer.accountServer.findCarrier(CarrierType.Email, params.email)
    if (!carrier) {
      throw AppException.exception(AccountErrorPhrase.AccountNotExists)
    }
    const account = await ssoServer.accountServer.findAccount(carrier.accountUid)
    account.assertPasswordCorrect(params.password)
    await this.onLoginSuccess(account)
  }

  public async handleJointBindOrLogin(params: {
    carrierType: CarrierType
    carrierUid: string
    accountUid: string | undefined
  }) {
    const ssoServer = this.ctx.ssoServer as SsoServer
    const accountServer = ssoServer.accountServer

    const { carrierType, carrierUid, accountUid } = params
    let accountV2 = await accountServer.findAccountWithCarrier(carrierType, carrierUid)

    // accountUid 存在时，用于绑定场景；其它则用于联合登录场景
    if (accountUid) {
      assert.ok(!accountV2, '绑定失败，已绑定其他账号')
      accountV2 = await accountServer.findAccount(accountUid)
      assert.ok(!!accountV2, '绑定失败，当前登录的账号异常')
      await accountV2.linkCarrier(carrierType, carrierUid)
    }

    assert.ok(!!accountV2, '账号异常')

    await this.onLoginSuccess(accountV2!)
  }
}
