export interface TenantAccessTokenResponse {
  code: number
  expire: number
  msg: string // 'ok'
  tenant_access_token: string
}
