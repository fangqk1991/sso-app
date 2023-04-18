import { SsoConfig } from '../SsoConfig'
import { GlobalAppConfig } from 'fc-config'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { SsoPowerSpecDocItems } from './power/SsoPowerSpecDocItems'
import { UserVisitorCenter } from '../services/UserVisitorCenter'
import { LoopPerformerHelper } from '@fangcha/backend-kit'
import { FeishuDepartmentCenter } from '../services/FeishuDepartmentCenter'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-power',
  feishuBotKey: SsoConfig.feishuBotKey,
  wecomBotKey: SsoConfig.wecomBotKey,
  useJwtSpecs: true,
  mainDocItems: SsoPowerSpecDocItems,
  routerOptions: {
    backendPort: SsoConfig.powerPort,
    baseURL: SsoConfig.powerBaseURL,
    basicAuthProtocol: {
      findVisitor: (username: string, password: string) => {
        const visitor = UserVisitorCenter.getVisitorInfo(username, password)
        return {
          visitorId: visitor.appid,
          name: visitor.name,
          secrets: visitor.secrets,
          permissionKeys: [],
          isEnabled: visitor.isEnabled,
        }
      },
    },
  },
  plugins: [],

  appDidLoad: async () => {
    await Promise.all([UserVisitorCenter.reloadVisitorsData(), FeishuDepartmentCenter.reloadData()])
    LoopPerformerHelper.loopHandle(async () => {
      await UserVisitorCenter.reloadVisitorsData()
    })
    LoopPerformerHelper.makeLoopPerformer(5 * 60 * 1000).execute(async () => {
      await FeishuDepartmentCenter.reloadData()
    })
  },
  checkHealth: async () => {},
})
app.launch()
