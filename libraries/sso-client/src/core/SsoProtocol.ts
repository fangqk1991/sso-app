import { OAuthClientConfig } from './OAuthClientConfig'

interface JwtOptions {
  jwtKey: string
  jwtSecret: string
}

export interface SsoProtocol<T = any> {
  oauthConfig: OAuthClientConfig
  getUserInfo: (accessToken: string) => Promise<T>
  jwtOptions: JwtOptions
}
