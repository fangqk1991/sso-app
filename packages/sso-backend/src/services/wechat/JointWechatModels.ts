export interface JointWechatConfig {
  baseUrl: string
  appid: string
  secret: string
  redirectUri: string
}

export interface WechatTokenData {
  access_token: string
  expires_in: number
  refresh_token: string
  openid: string
  scope: string
  unionid: string
}
