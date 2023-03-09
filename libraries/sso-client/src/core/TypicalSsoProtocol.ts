import { OAuthClientConfig } from './OAuthClientConfig'

interface JwtOptions {
  jwtKey: string
  jwtSecret: string
}

export interface TypicalSsoProtocol {
  oauthConfig: OAuthClientConfig & { userInfoURL: string }
  jwtOptions: JwtOptions
}
