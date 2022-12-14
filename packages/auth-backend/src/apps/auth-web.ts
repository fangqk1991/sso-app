import { AuthConfig } from '../AuthConfig'
import { GlobalAppConfig } from 'fc-config'
import { SsoWebPlugin } from '@fangcha/sso-server/lib/web-sdk'
import { SsoClientsAutoReloadPlugin } from '@fangcha/sso-server/lib/sdk'
import { MySsoServer } from '../services/MySsoServer'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-web',
  wecomBotKey: AuthConfig.wecomBotKey,
  useJwtSpecs: true,
  routerOptions: {
    backendPort: AuthConfig.webPort,
    baseURL: AuthConfig.webBaseURL,
    jwtProtocol: {
      jwtKey: AuthConfig.webJwtKey,
      jwtSecret: AuthConfig.webJwtSecret,
    },
  },
  plugins: [
    SsoWebPlugin({
      signupAble: AuthConfig.frontendConfig.signupAble,
      ssoServer: MySsoServer,
    }),
    SsoClientsAutoReloadPlugin(MySsoServer),
  ],

  appDidLoad: async () => {
    _FangchaState.frontendConfig = AuthConfig.frontendConfig
  },
  checkHealth: async () => {},
})
app.launch()
