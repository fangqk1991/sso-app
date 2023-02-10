import { P_GroupDetail, P_GroupParams, P_MemberInfo, P_MemberParams } from './GroupModels'
import { P_AppInfo, P_AppParams } from './AppModels'

export interface GroupImportParams extends P_GroupParams {
  groupId: string
  name: string
  remarks: string
  groupAlias: string
  departmentId: number | null
  isFullDepartment: number
  isRetained: number
  permissionKeys: string[]
  members: P_MemberParams[]
  author?: string
}

export interface GroupExportInfo extends P_GroupDetail {
  permissionKeys: string[]
  members: P_MemberInfo[]
}

export interface AppImportParams extends P_AppParams {
  groupList: GroupImportParams[]
}

export interface AppExportInfo extends P_AppInfo {
  groupList: GroupExportInfo[]
}
