import { SsoConfig } from '../SsoConfig'
import { GlobalAppConfig } from 'fc-config'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { SsoPowerSpecDocItems } from './power/SsoPowerSpecDocItems'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-power',
  wecomBotKey: SsoConfig.wecomBotKey,
  useJwtSpecs: true,
  mainDocItems: SsoPowerSpecDocItems,
  routerOptions: {
    backendPort: SsoConfig.powerPort,
    baseURL: SsoConfig.powerBaseURL,
    basicAuthProtocol: {
      findVisitor: (username: string, password: string) => {
        return {
          visitorId: username,
          name: username,
          secrets: [password],
          permissionKeys: [],
          isEnabled: true,
        }
      },
    },
  },
  plugins: [],

  appDidLoad: async () => {},
  checkHealth: async () => {},
})
app.launch()
