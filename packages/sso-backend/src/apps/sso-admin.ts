import { GlobalAppConfig } from 'fc-config'
import { WebAuthSdkPlugin } from '@fangcha/backend-kit/lib/auth'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoAdminSpecDocItems } from './admin/SsoAdminSpecDocItems'
import { SsoAdminConfig } from '../SsoConfig'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-admin',
  wecomBotKey: SsoAdminConfig.wecomBotKey,
  routerOptions: {
    baseURL: SsoAdminConfig.adminBaseURL,
    backendPort: SsoAdminConfig.adminPort,
    jwtProtocol: {
      jwtKey: SsoAdminConfig.adminJwtKey,
      jwtSecret: SsoAdminConfig.adminJwtSecret,
    },
  },
  mainDocItems: SsoAdminSpecDocItems,
  plugins: [
    WebAuthSdkPlugin({
      authMode: SsoAdminConfig.WebAuth.authMode,
      simpleAuth: {
        retainedUserData: SsoAdminConfig.WebAuth.retainedUserData,
      },
      ssoAuth: SsoAdminConfig.WebAuth.oauthConfig,
    }),
  ],

  appDidLoad: async () => {
    _FangchaState.frontendConfig = {
      ...SsoAdminConfig.frontendConfig,
      authMode: SsoAdminConfig.WebAuth.authMode,
    }
  },
  checkHealth: async () => {},
})
app.launch()
