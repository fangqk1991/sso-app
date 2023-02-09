import { AuthConfig } from '../AuthConfig'

export class TableManager {
  public prefix = ''

  public constructor(prefix: string) {
    this.prefix = prefix ? `${prefix}_` : ''
  }

  public tableName_Account() {
    return this.prefix + 'fc_account'
  }

  public tableName_AccountCarrier() {
    return this.prefix + 'fc_account_carrier'
  }

  public tableName_AccountCarrierExtras() {
    return this.prefix + 'fc_account_carrier_extras'
  }

  public tableName_SsoClient() {
    return this.prefix + 'fc_sso_client'
  }

  public tableName_UserAuth() {
    return this.prefix + 'fc_user_auth'
  }
}

export const MyTableManager = new TableManager(AuthConfig.sqlTablePrefix)
