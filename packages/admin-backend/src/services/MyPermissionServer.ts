import { PermissionServer } from '../core/PermissionServer'
import { MyDatabase } from './MyDatabase'
import { MyTableManager } from './MyTableManager'

export const MyPermissionServer = new PermissionServer({
  database: MyDatabase.ssoDB,
  tableName_App: MyTableManager.tableName_App(),
  tableName_AppAccess: MyTableManager.tableName_AppAccess(),
  tableName_Group: MyTableManager.tableName_Group(),
  tableName_GroupAccess: MyTableManager.tableName_GroupAccess(),
  tableName_GroupMember: MyTableManager.tableName_GroupMember(),
  tableName_GroupPermission: MyTableManager.tableName_GroupPermission(),
})
