export interface JointWechatConfig {
  baseUrl: string
  appid: string
  secret: string
  redirectUri: string
}

export interface WechatUserInfo {
  openid: string
  nickname: string
  sex: number
  language: string
  city: string
  province: string
  country: string
  headimgurl: string
  privilege: []
  unionid: string
}

export interface WechatTokenData {
  access_token: string
  expires_in: number
  refresh_token: string
  openid: string
  scope: string
  unionid: string
}
