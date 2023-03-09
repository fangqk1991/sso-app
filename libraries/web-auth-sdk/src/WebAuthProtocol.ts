import { AccountServer } from '@fangcha/account'
import { AuthMode } from '@fangcha/account-models'
import { OAuthClientConfig } from '@fangcha/sso-client'

interface JwtOptions {
  jwtKey: string
  jwtSecret: string
}

export interface SimpleAuthProtocol {
  retainedUserData?: {
    // username -> password
    [username: string]: string
  }
  accountServer?: AccountServer
}

export interface WebAuthProtocol {
  authMode: AuthMode
  jwtOptions: JwtOptions
  simpleAuth?: SimpleAuthProtocol
  ssoAuth?: OAuthClientConfig & { userInfoURL: string }
}
