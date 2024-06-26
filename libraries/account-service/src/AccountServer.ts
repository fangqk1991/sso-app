import { FCDatabase } from 'fc-sql'
import { AccountErrorPhrase, AccountFullParams, CarrierType } from '@fangcha/account-models'
import { makeUUID } from '@fangcha/tools'
import * as bcrypt from 'bcryptjs'
import { AppException } from '@fangcha/app-error'
import { _Account } from './models/account/_Account'
import { _AccountCarrier } from './models/account/_AccountCarrier'
import { _AccountCarrierExtras } from './models/account/_AccountCarrierExtras'
import { _FullAccount } from './models/account/_FullAccount'
import assert from '@fangcha/assert'

interface Options {
  database: FCDatabase

  // Default: fc_account
  tableName_Account?: string

  // Default: fc_account_carrier
  tableName_AccountCarrier?: string

  // Default: fc_account_carrier_extras
  tableName_AccountCarrierExtras?: string
}

export class AccountServer {
  public readonly options: Options
  public readonly database: FCDatabase
  public readonly Account!: { new (): _Account } & typeof _Account
  public readonly AccountCarrier!: { new (): _AccountCarrier } & typeof _AccountCarrier
  public readonly AccountCarrierExtras!: { new (): _AccountCarrierExtras } & typeof _AccountCarrierExtras
  public readonly FullAccount!: { new (): _FullAccount } & typeof _FullAccount

  private readonly tableName_Account: string
  private readonly tableName_AccountCarrier: string
  private readonly tableName_AccountCarrierExtras: string

  constructor(options: Options) {
    this.options = options

    this.database = options.database

    this.tableName_Account = options.tableName_Account || 'fc_account'
    this.tableName_AccountCarrier = options.tableName_AccountCarrier || 'fc_account_carrier'
    this.tableName_AccountCarrierExtras = options.tableName_AccountCarrierExtras || 'fc_account_carrier_extras'

    class AccountCarrier extends _AccountCarrier {}
    AccountCarrier.addStaticOptions({
      database: options.database,
      table: this.tableName_AccountCarrier,
    })
    this.AccountCarrier = AccountCarrier

    class Account extends _Account {}
    Account.addStaticOptions({
      database: options.database,
      table: this.tableName_Account,
    })
    Account.AccountCarrier = AccountCarrier
    this.Account = Account

    class AccountCarrierExtras extends _AccountCarrierExtras {}
    AccountCarrierExtras.addStaticOptions({
      database: options.database,
      table: this.tableName_AccountCarrierExtras,
    })
    this.AccountCarrierExtras = AccountCarrierExtras

    class FullAccount extends _FullAccount {}
    FullAccount.setOptions(
      options.database,
      `${this.tableName_Account} AS account
      LEFT JOIN ${this.tableName_AccountCarrier} AS email_carrier
      ON account.account_uid = email_carrier.account_uid AND email_carrier.carrier_type = "${CarrierType.Email}"
      LEFT JOIN ${this.tableName_AccountCarrier} AS phone_carrier
      ON account.account_uid = email_carrier.account_uid AND email_carrier.carrier_type = "${CarrierType.Phone}"
      `
    )
    this.FullAccount = FullAccount
  }

  public async findAccount(accountUid: string) {
    return (await this.Account.findOne({
      account_uid: accountUid,
    }))!
  }

  public async findAccountWithCarrier(carrierType: CarrierType, carrierUid: string) {
    const carrier = await this.findCarrier(carrierType, carrierUid)
    if (carrier) {
      return this.findAccount(carrier.accountUid)
    }
  }

  public async findCarrier(carrierType: CarrierType, carrierUid: string) {
    return (await this.AccountCarrier.findOne({
      carrier_type: carrierType,
      carrier_uid: carrierUid,
    }))!
  }

  public makeSaltedPassword(password: string) {
    return bcrypt.hashSync(password || makeUUID(), bcrypt.genSaltSync())
  }

  public async updateAccountPassword(account: _Account, newPassword: string) {
    account.fc_edit()
    account.password = this.makeSaltedPassword(newPassword)
    await account.updateToDB()
  }

  public async updateEmail(account: _Account, email: string) {
    const userInfo = await account.getVisitorCoreInfo()
    assert.ok(!userInfo.email || !!userInfo.email.match(/^\w{12}@wechat.qq$/), `本账号 email 已设置`)

    if (await this.AccountCarrier.findOne({ carrier_type: CarrierType.Email, carrier_uid: email })) {
      throw AppException.exception(AccountErrorPhrase.EmailAlreadyRegistered)
    }

    const carrier = new this.AccountCarrier()
    carrier.carrierType = CarrierType.Email
    carrier.carrierUid = email
    carrier.accountUid = account.accountUid
    await carrier.strongAddToDB()
  }

  public async createAccount(fullParams: AccountFullParams) {
    const email = fullParams.email || ''

    const account = new this.Account()
    account.accountUid = makeUUID()
    account.password = fullParams.password ? this.makeSaltedPassword(fullParams.password) : ''
    account.isEnabled = 1
    account.registerIp = fullParams.registerIp || ''
    account.nickName = fullParams.nickName || email.split('@')[0] || ''

    if (await this.AccountCarrier.findOne({ carrier_type: CarrierType.Email, carrier_uid: email })) {
      throw AppException.exception(AccountErrorPhrase.EmailAlreadyRegistered)
    }

    const carrier = new this.AccountCarrier()
    carrier.carrierType = CarrierType.Email
    carrier.carrierUid = email
    carrier.accountUid = account.accountUid

    const runner = await account.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await account.addToDB(transaction)
      await carrier.addToDB(transaction)
    })
    return account
  }
}
