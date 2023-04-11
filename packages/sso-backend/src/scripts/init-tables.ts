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

    .replace(/\bfc_app\b/g, MyTableManager.tableName_App())
    .replace(/\bfc_app_access\b/g, MyTableManager.tableName_AppAccess())
    .replace(/\bfc_group\b/g, MyTableManager.tableName_Group())
    .replace(/\bfc_group_access\b/g, MyTableManager.tableName_GroupAccess())
    .replace(/\bfc_group_permission\b/g, MyTableManager.tableName_GroupPermission())
    .replace(/\bfc_group_member\b/g, MyTableManager.tableName_GroupMember())

    .replace(/\bfc_feishu_department\b/g, MyTableManager.tableName_FeishuDepartment())
    .replace(/\bfc_feishu_department_member\b/g, MyTableManager.tableName_FeishuDepartmentMember())
    .replace(/\bfc_feishu_user\b/g, MyTableManager.tableName_FeishuUser())

  const database = new FCDatabase()
  database.init({
    ...SsoConfig.mysql.ssoDB,
    dialectOptions: {
      multipleStatements: true,
    },
  })
  await database.update(newContent)
})
