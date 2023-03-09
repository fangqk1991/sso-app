import { OAuthClientConfig } from './OAuthClientConfig'

export interface SsoProtocol<T = any> {
  oauthConfig: OAuthClientConfig
  getUserInfo: (accessToken: string) => Promise<T>
}
