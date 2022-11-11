import { AuthConfig } from '../AuthConfig'
import { GlobalAppConfig } from 'fc-config'
import { FangchaApp } from '@fangcha/backend-kit'
import { SsoWebPlugin } from '@fangcha/sso-server/lib/web-sdk'
import { SsoClientsAutoReloadPlugin } from '@fangcha/sso-server/lib/sdk'
import { MySsoServer } from '../services/MySsoServer'

const app = new FangchaApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-web',
  wecomBotKey: AuthConfig.wecomBotKey,
  plugins: [
    SsoWebPlugin({
      backendPort: AuthConfig.webPort,
      ssoServer: MySsoServer,
    }),
    SsoClientsAutoReloadPlugin(MySsoServer),
  ],

  appDidLoad: async () => {},
  checkHealth: async () => {},
})
app.launch()
