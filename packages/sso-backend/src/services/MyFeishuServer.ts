import { MyDatabase } from './MyDatabase'
import { FeishuServer } from '@fangcha/account'
import { MyTableManager } from './MyTableManager'

export const MyFeishuServer = new FeishuServer({
  database: MyDatabase.ssoDB,
  tableName_FeishuDepartment: MyTableManager.tableName_FeishuDepartment(),
  tableName_FeishuDepartmentMember: MyTableManager.tableName_FeishuDepartmentMember(),
  tableName_FeishuUser: MyTableManager.tableName_FeishuUser(),
})
