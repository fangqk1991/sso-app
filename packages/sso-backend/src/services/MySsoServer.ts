import { SsoServer } from '@fangcha/sso-server'
import { MyDatabase } from './MyDatabase'
import { AccountServer } from '@fangcha/account'
import { SsoConfig } from '../SsoConfig'
import { MyTableManager } from './MyTableManager'

export const MySsoServer = new SsoServer({
  database: MyDatabase.ssoDB,
  redisConfig: SsoConfig.redisCache,
  tableName_SsoClient: MyTableManager.tableName_SsoClient(),
  tableName_UserAuth: MyTableManager.tableName_UserAuth(),
  accountServer: new AccountServer({
    database: MyDatabase.ssoDB,
    tableName_Account: MyTableManager.tableName_Account(),
    tableName_AccountCarrier: MyTableManager.tableName_AccountCarrier(),
    tableName_AccountCarrierExtras: MyTableManager.tableName_AccountCarrierExtras(),
  }),
})
