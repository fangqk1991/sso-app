import { SsoConfig } from '../SsoConfig'
import { GlobalAppConfig } from 'fc-config'
import { MySsoServer } from '../services/MySsoServer'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoClientsAutoReloadPlugin, SsoWebPlugin } from '@fangcha/sso-server-sdk'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-web',
  feishuBotKey: SsoConfig.feishuBotKey,
  wecomBotKey: SsoConfig.wecomBotKey,
  useJwtSpecs: true,
  routerOptions: {
    backendPort: SsoConfig.webPort,
    baseURL: SsoConfig.webBaseURL,
    jwtProtocol: {
      jwtKey: SsoConfig.webJwtKey,
      jwtSecret: SsoConfig.webJwtSecret,
    },
  },
  plugins: [
    SsoWebPlugin({
      signupAble: SsoConfig.frontendConfig.signupAble,
      ssoServer: MySsoServer,
    }),
    SsoClientsAutoReloadPlugin(MySsoServer),
  ],

  appDidLoad: async () => {
    _FangchaState.frontendConfig = SsoConfig.frontendConfig
  },
  checkHealth: async () => {},
})
app.launch()
