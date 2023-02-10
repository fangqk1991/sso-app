import { SsoAppConfig } from '../SsoConfig'
import { GlobalAppConfig } from 'fc-config'
import { MySsoServer } from '../services/MySsoServer'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoClientsAutoReloadPlugin, SsoWebPlugin } from '@fangcha/sso-server-sdk'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-web',
  wecomBotKey: SsoAppConfig.wecomBotKey,
  useJwtSpecs: true,
  routerOptions: {
    backendPort: SsoAppConfig.webPort,
    baseURL: SsoAppConfig.webBaseURL,
    jwtProtocol: {
      jwtKey: SsoAppConfig.webJwtKey,
      jwtSecret: SsoAppConfig.webJwtSecret,
    },
  },
  plugins: [
    SsoWebPlugin({
      signupAble: SsoAppConfig.frontendConfig.signupAble,
      ssoServer: MySsoServer,
    }),
    SsoClientsAutoReloadPlugin(MySsoServer),
  ],

  appDidLoad: async () => {
    _FangchaState.frontendConfig = SsoAppConfig.frontendConfig
  },
  checkHealth: async () => {},
})
app.launch()
