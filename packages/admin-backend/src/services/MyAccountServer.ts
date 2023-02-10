import { AccountServer } from '@fangcha/account'
import { MyDatabase } from './MyDatabase'
import { MyTableManager } from './MyTableManager'

export const MyAccountServer = new AccountServer({
  database: MyDatabase.ssoDB,
  tableName_Account: MyTableManager.tableName_Account(),
  tableName_AccountCarrier: MyTableManager.tableName_AccountCarrier(),
  tableName_AccountCarrierExtras: MyTableManager.tableName_AccountCarrierExtras(),
})
