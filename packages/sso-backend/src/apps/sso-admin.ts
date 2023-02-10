import { GlobalAppConfig } from 'fc-config'
import { WebAuthSdkPlugin } from '@fangcha/backend-kit/lib/auth'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoAdminSpecDocItems } from './admin/SsoAdminSpecDocItems'
import { SsoConfig } from '../SsoConfig'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-admin',
  wecomBotKey: SsoConfig.wecomBotKey,
  routerOptions: {
    baseURL: SsoConfig.adminBaseURL,
    backendPort: SsoConfig.adminPort,
    jwtProtocol: {
      jwtKey: SsoConfig.adminJwtKey,
      jwtSecret: SsoConfig.adminJwtSecret,
    },
  },
  mainDocItems: SsoAdminSpecDocItems,
  plugins: [
    WebAuthSdkPlugin({
      authMode: SsoConfig.adminAuth.authMode,
      simpleAuth: {
        retainedUserData: SsoConfig.adminAuth.retainedUserData,
      },
      ssoAuth: SsoConfig.adminAuth.oauthConfig,
    }),
  ],

  appDidLoad: async () => {
    _FangchaState.frontendConfig = {
      ...SsoConfig.adminFrontendConfig,
      authMode: SsoConfig.adminAuth.authMode,
    }
  },
  checkHealth: async () => {},
})
app.launch()
