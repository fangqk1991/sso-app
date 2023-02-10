import * as fs from 'fs'
import { SafeTask } from '@fangcha/tools'
import { SsoConfig } from '../SsoConfig'
import { FCDatabase } from 'fc-sql'
import { MyTableManager } from '../services/MyTableManager'

SafeTask.run(async () => {
  const filePath = `${__dirname}/../../../../config/schemas.sql`
  const content = fs.readFileSync(filePath, 'utf8')

  const newContent = content
    .replace(/\bfc_account\b/g, MyTableManager.tableName_Account())
    .replace(/\bfc_account_carrier\b/g, MyTableManager.tableName_AccountCarrier())
    .replace(/\bfc_account_carrier_extras\b/g, MyTableManager.tableName_AccountCarrierExtras())
    .replace(/\bfc_sso_client\b/g, MyTableManager.tableName_SsoClient())
    .replace(/\bfc_user_auth\b/g, MyTableManager.tableName_UserAuth())

  const database = new FCDatabase()
  database.init({
    ...SsoConfig.mysql.ssoDB,
    dialectOptions: {
      multipleStatements: true,
    },
  })
  await database.update(newContent)
})
