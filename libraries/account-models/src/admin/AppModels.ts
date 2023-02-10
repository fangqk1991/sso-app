import { PermissionMeta } from './PermissionModels'
import { FullGroupInfo, GroupExportInfo, GroupImportParams } from './GroupModels'
import { AppType } from './AppType'

export interface P_AppParams {
  appid: string
  name: string
  remarks: string
  appType: AppType
  configData: {}
  permissionMeta: PermissionMeta
  powerUserList: string[]
  author?: string
}

export interface P_AppInfo extends P_AppParams {
  appid: string
  name: string
  remarks: string
  author: string
  createTime: string
  updateTime: string
  powerUserList: string[]
  version: number
  swaggerPageUrl?: string
}

export interface AppFullInfo extends P_AppInfo {
  groups: FullGroupInfo[]
}

export interface P_AccessInfo {
  accessId: string
  appid: string
  appSecret: string
  createTime: string
  updateTime: string
}

export interface AppImportParams extends P_AppParams {
  groupList: GroupImportParams[]
}

export interface AppExportInfo extends P_AppInfo {
  groupList: GroupExportInfo[]
}
