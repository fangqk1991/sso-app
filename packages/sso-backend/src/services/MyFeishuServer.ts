import { MyDatabase } from './MyDatabase'
import { MyTableManager } from './MyTableManager'
import { FeishuServer } from '@fangcha/feishu-sdk'

export const MyFeishuServer = new FeishuServer({
  database: MyDatabase.ssoDB,
  tableName_FeishuDepartment: MyTableManager.tableName_FeishuDepartment(),
  tableName_FeishuDepartmentMember: MyTableManager.tableName_FeishuDepartmentMember(),
  tableName_FeishuUser: MyTableManager.tableName_FeishuUser(),
})
