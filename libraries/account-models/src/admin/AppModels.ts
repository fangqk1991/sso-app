import { PermissionMeta } from './PermissionModels'
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

export interface P_AccessInfo {
  accessId: string
  appid: string
  appSecret: string
  author: string
  createTime: string
  updateTime: string
}
