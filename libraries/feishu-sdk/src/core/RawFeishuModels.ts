import { FeishuEmployeeStatus } from './FeishuEmployeeStatus'

export interface TenantAccessTokenResponse {
  code: number
  msg: string // 'ok'
  expire: number
  tenant_access_token: string
}

export interface FeishuResponse<T> {
  code: number
  msg: string // 'ok'
  data: T
}

export interface FeishuPageDataResponse<T> {
  code: number
  msg: string // 'ok'
  data: {
    has_more: boolean
    items: T[]
    page_token?: string
  }
}

/**
 * https://open.feishu.cn/document/home/user-identity-introduction/introduction
 * https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/field-overview
 * user_id_type: open_id(ou_ 开头), union_id(on_ 开头), open_id(较短的一串)
 * open_id：标识一个用户在某个应用中的身份。同一个用户在不同应用中的 Open ID 不同。
 * union_id：标识一个用户在某个应用开发商下的身份。同一用户在同一开发商下的应用中的 Union ID 是相同的，在不同开发商下的应用中的 Union ID 是不同的。通过 Union ID，应用开发商可以把同个用户在多个应用中的身份关联起来。
 * user_id：标识一个用户在某个租户内的身份。同一个用户在租户 A 和租户 B 内的 User ID 是不同的。在同一个租户内，一个用户的 User ID 在所有应用（包括商店应用）中都保持一致。User ID 主要用于在不同的应用间打通用户数据。
 */
export interface Raw_FeishuEmployee {
  user_id: string
  system_fields: {
    employee_no: string
    employee_type: number
    en_name: string
    name: string
    status: FeishuEmployeeStatus
    work_location?: {
      name: string
    }
  }
}

export interface Raw_FeishuUser {
  user_id: string
  open_id: string
  union_id: string
  name: string
  en_name: string
  email: string
  mobile: string
  mobile_visible: boolean
  gender: number
  avatar_key: string
  department_ids: string[]
  leader_user_id: string
  city: string
  work_station: string
  country: string
  join_time: number
  employee_no: string
  employee_type: number
  // enterprise_email: string
  job_title: string
  status: FeishuUserStatus
}

export interface Raw_FeishuUserGroup {
  id: string
  name: string
  description: string
  member_user_count: number
  member_department_count: number
  type: number
  department_scope_list: string[]
  group_id: string
}

/**
 * https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/department/field-overview#23857fe0
 * department_id 用来标识租户内一个唯一的部门，支持在创建部门时自定义。若不自定义则由系统默认生成唯一的 department_id。
 * 已经创建的部门，不允许修改 department_id。
 * open_department_id 用来在具体某个应用中标识一个部门，同一个department_id 在不同应用中的 open_department_id 相同。
 */
export interface Raw_FeishuDepartment {
  chat_id: string
  department_id: string
  open_department_id: string
  parent_department_id: string
  name: string
  group_chat_employee_types: number[]
  leader_user_id: string
  leaders: {
    leaderID: string
    leaderType: number
  }[]
  member_count: number
  status: {
    is_deleted: boolean
  }
}

export interface FeishuDepartmentResponse {
  code: number
  msg: string // 'ok'
  data: {
    department: Raw_FeishuDepartment
  }
}

export interface Raw_FeishuDepartmentTree {
  department: Raw_FeishuDepartment
  path: string
  children: Raw_FeishuDepartmentTree[]
  memberList: Raw_FeishuUser[]
}

// https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/field-overview
export interface FeishuUserStatus {
  is_frozen: boolean // 是否暂停
  is_resigned: boolean // 是否离职
  is_activated: boolean // 是否激活
  is_exited: boolean // 是否主动退出，主动退出一段时间后用户会自动转为已离职
  is_unjoin: boolean // 是否未加入，需要用户自主确认才能加入团队
}

export interface FeishuUserToken {
  access_token: string

  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  sid: string
  tenant_key: string
  token_type: 'Bearer'

  union_id: string
  user_id: string
  open_id: string

  name: string
  en_name: string
  avatar_big: string
  avatar_middle: string
  avatar_thumb: string
  avatar_url: string
  enterprise_email: string
}
