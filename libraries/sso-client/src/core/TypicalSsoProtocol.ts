import { OAuthClientConfig } from './OAuthClientConfig'

interface JwtOptions {
  jwtKey: string
  jwtSecret: string
}

export interface TypicalSsoProtocol<T = any> {
  oauthConfig: OAuthClientConfig & { userInfoURL: string }
  jwtOptions: JwtOptions
}
