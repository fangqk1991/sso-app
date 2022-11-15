import { SsoServer } from '@fangcha/sso-server'
import { MyDatabase } from './MyDatabase'
import { AccountServer } from '@fangcha/account'
import { AuthConfig } from '../AuthConfig'

export const MySsoServer = new SsoServer({
  database: MyDatabase.ssoDB,
  redisConfig: AuthConfig.redisCache,
  tableName_SsoClient: AuthConfig.ssoTableOptions.tableName_SsoClient,
  tableName_UserAuth: AuthConfig.ssoTableOptions.tableName_UserAuth,
  accountServer: new AccountServer({
    database: MyDatabase.ssoDB,
    tableName_Account: AuthConfig.accountTableOptions.tableName_Account,
    tableName_AccountCarrier: AuthConfig.accountTableOptions.tableName_AccountCarrier,
    tableName_AccountCarrierExtras: AuthConfig.accountTableOptions.tableName_AccountCarrierExtras,
  }),
})
