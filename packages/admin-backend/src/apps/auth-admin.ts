import { AuthConfig } from '../AuthConfig'
import { GlobalAppConfig } from 'fc-config'
import { WebAuthSdkPlugin } from '@fangcha/backend-kit/lib/auth'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoAdminSpecDocItems } from './admin/SsoAdminSpecDocItems'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-admin',
  wecomBotKey: AuthConfig.wecomBotKey,
  routerOptions: {
    baseURL: AuthConfig.adminBaseURL,
    backendPort: AuthConfig.adminPort,
    jwtProtocol: {
      jwtKey: AuthConfig.adminJwtKey,
      jwtSecret: AuthConfig.adminJwtSecret,
    },
  },
  mainDocItems: SsoAdminSpecDocItems,
  plugins: [
    WebAuthSdkPlugin({
      authMode: AuthConfig.WebAuth.authMode,
      simpleAuth: {
        retainedUserData: AuthConfig.WebAuth.retainedUserData,
      },
      ssoAuth: AuthConfig.WebAuth.oauthConfig,
    }),
  ],

  appDidLoad: async () => {
    _FangchaState.frontendConfig = {
      ...AuthConfig.frontendConfig,
      authMode: AuthConfig.WebAuth.authMode,
    }
  },
  checkHealth: async () => {},
})
app.launch()
