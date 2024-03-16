export interface GoogleUserInfo {
  azp: string
  aud: string
  sub: string
  scope: string // 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'
  exp: string
  expires_in: string
  email: string
  email_verified: string // 'true'
  access_type: string // 'online'
  iss: string // 'https://accounts.google.com'
  at_hash: string
  name: string
  picture: string
  given_name: string
  family_name: string
  locale: string // 'zh-CN'
  iat: string
  alg: string // 'RS256'
  kid: string
  typ: string // 'JWT'
}
