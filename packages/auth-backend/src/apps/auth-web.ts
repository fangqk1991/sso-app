import { AuthConfig } from '../AuthConfig'
import { GlobalAppConfig } from 'fc-config'
import { SsoWebPlugin } from '@fangcha/sso-server/lib/web-sdk'
import { SsoClientsAutoReloadPlugin } from '@fangcha/sso-server/lib/sdk'
import { MySsoServer } from '../services/MySsoServer'
import { WebApp } from '@fangcha/backend-kit/lib/router'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-web',
  wecomBotKey: AuthConfig.wecomBotKey,
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
      ssoServer: MySsoServer,
    }),
    SsoClientsAutoReloadPlugin(MySsoServer),
  ],

  appDidLoad: async () => {},
  checkHealth: async () => {},
})
app.launch()
