export interface TenantAccessTokenResponse {
  code: number
  expire: number
  msg: string // 'ok'
  tenant_access_token: string
}

export interface FeishuEmployee {
  user_id: string
  system_fields: {
    employee_no: string
    employee_type: number
    en_name: string
    name: string
    status: number
  }
}

export interface EmployeePageDataResponse {
  code: number
  msg: string // 'ok'
  data: {
    has_more: boolean
    items: FeishuEmployee[]
    page_token?: string
  }
}
