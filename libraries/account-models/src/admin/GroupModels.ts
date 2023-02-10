export interface P_GroupParams {
  name: string
  remarks: string
  isRetained: number
  isEnabled: number
  blackPermission: number
  groupAlias: string
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

  fullMemberEmails: string[]
}

export interface FullGroupInfo extends P_GroupDetail {
  permissionKeys: string[]
  memberEmails: string[]
  groupSecrets: string[]
}

export interface P_MemberParams {
  member: string
  isAdmin: number
}

export interface P_MemberInfo {
  groupId: string
  member: string
  isAdmin: number
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
