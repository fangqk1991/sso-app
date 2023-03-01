import { AccountServer } from '@fangcha/account'
import { AuthMode } from '@fangcha/account-models'
import { OAuthClientConfig } from '@fangcha/tools/lib/oauth-client'

export interface SimpleAuthProtocol {
  retainedUserData?: {
    // username -> password
    [username: string]: string
  }
  accountServer?: AccountServer
}

export interface WebAuthProtocol {
  authMode: AuthMode
  simpleAuth?: SimpleAuthProtocol
  ssoAuth?: OAuthClientConfig & { userInfoURL: string }
}