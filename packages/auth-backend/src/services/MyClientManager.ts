import { SsoClientManager } from '@fangcha/sso-server'
import { MyDatabase } from './MyDatabase'
import { MyTableManager } from './MyTableManager'

export const MyClientManager = new SsoClientManager({
  database: MyDatabase.ssoDB,
  tableName_SsoClient: MyTableManager.tableName_SsoClient(),
  tableName_UserAuth: MyTableManager.tableName_UserAuth(),
})
