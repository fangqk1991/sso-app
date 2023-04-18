import { GroupCategory } from './GroupCategory'

export interface P_GroupParams {
  groupCategory: GroupCategory
  name: string
  remarks: string
  isRetained: number
  isEnabled: number
  blackPermission: number
  groupAlias: string
  departmentId: string | null
  isFullDepartment: number
  author?: string
  subGroupIdList: string[]
}

export interface P_GroupInfo extends P_GroupParams {
  appid: string
  groupId: string
  name: string
  remarks: string
  author: string
  createTime: string
  updateTime: string
  groupAlias: string
  blackPermission: number
  isEnabled: number
}

export interface P_GroupDetail extends P_GroupInfo {
  permissionKeys: string[]
  subGroupMapper: {
    [groupId: string]: P_GroupInfo
  }
  fullSubGroupIdList: string[]

  fullMemberIdList?: string[]
}

export interface P_MemberParams {
  userId: string
  remarks: string
}

export interface P_MemberInfo {
  groupId: string
  userId: string
  remarks: string
  createTime: string
  updateTime: string
}

export interface P_GroupAccessInfo {
  accessId: string
  groupId: string
  groupSecret: string
  createTime: string
  updateTime: string
}

export interface P_Tmp_VisitorParams {
  visitorId: string
  secret: string
  name: string
}
