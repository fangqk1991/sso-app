import * as fs from 'fs'
import { SafeTask } from '@fangcha/tools'
import { AuthConfig } from '../AuthConfig'
import { FCDatabase } from 'fc-sql'

SafeTask.run(async () => {
  const filePath = `${__dirname}/../../../../config/schemas.sql`
  const content = fs.readFileSync(filePath, 'utf8')

  const newContent = content
    .replace(/\bfc_account\b/g, AuthConfig.accountTableOptions.tableName_Account)
    .replace(/\bfc_account_carrier\b/g, AuthConfig.accountTableOptions.tableName_AccountCarrier)
    .replace(/\bfc_account_carrier_extras\b/g, AuthConfig.accountTableOptions.tableName_AccountCarrierExtras)
    .replace(/\bfc_sso_client\b/g, AuthConfig.ssoTableOptions.tableName_SsoClient)
    .replace(/\bfc_user_auth\b/g, AuthConfig.ssoTableOptions.tableName_UserAuth)

  const database = new FCDatabase()
  database.init({
    ...AuthConfig.mysql.ssoDB,
    dialectOptions: {
      multipleStatements: true,
    },
  })
  await database.update(newContent)
})
