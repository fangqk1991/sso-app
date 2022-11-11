import { SsoServer } from '@fangcha/sso-server'
import { MyDatabase } from './MyDatabase'
import { AccountServer } from '@fangcha/account'
import { AuthConfig } from '../AuthConfig'

export const MySsoServer = new SsoServer({
  database: MyDatabase.ssoDB,
  redisConfig: AuthConfig.redisCache,
  webBaseURL: AuthConfig.webBaseURL,
  webJwtKey: AuthConfig.webJwtKey,
  webJwtSecret: AuthConfig.webJwtSecret,
  tableName_SsoClient: 'sso_client',
  tableName_UserAuth: 'user_auth',
  accountServer: new AccountServer({
    database: MyDatabase.ssoDB,
    tableName_Account: AuthConfig.WebAuth.accountTableOptions.tableName_Account,
    tableName_AccountCarrier: AuthConfig.WebAuth.accountTableOptions.tableName_AccountCarrier,
    tableName_AccountCarrierExtras: AuthConfig.WebAuth.accountTableOptions.tableName_AccountCarrierExtras,
  }),
})
