import { JwtOptions } from './WebAuthProtocol'
import { AppPluginProtocol } from '@fangcha/backend-kit'
import { OAuthClientConfig } from './OAuthClientConfig'
import { AuthMode } from '@fangcha/account-models'
import { WebAuthSdkPlugin } from './WebAuthSdkPlugin'

export const SsoSdkPlugin = (options: { jwtOptions: JwtOptions; ssoAuth: OAuthClientConfig }): AppPluginProtocol => {
  return WebAuthSdkPlugin({
    authMode: AuthMode.SSO,
    jwtOptions: options.jwtOptions,
    ssoAuth: options.ssoAuth,
  })
}
