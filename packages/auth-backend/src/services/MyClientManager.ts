import { SsoClientManager } from '@fangcha/sso-server'
import { MyDatabase } from './MyDatabase'

export const MyClientManager = new SsoClientManager({
  database: MyDatabase.ssoDB,
  tableName_SsoClient: 'sso_client',
  tableName_UserAuth: 'user_auth',
})
