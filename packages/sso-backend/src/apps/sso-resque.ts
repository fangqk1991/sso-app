import { FangchaApp } from '@fangcha/backend-kit'
import { ResqueSdkPlugin } from '@fangcha/backend-kit/lib/resque'
import { GlobalAppConfig } from 'fc-config'
import { SsoResqueTaskMapper } from './resque'
import { SsoConfig } from '../SsoConfig'

const app = new FangchaApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-resque',
  feishuBotKey: SsoConfig.feishuBotKey,
  wecomBotKey: SsoConfig.wecomBotKey,
  plugins: [
    ResqueSdkPlugin({
      redisConfig: SsoConfig.ssoResque,
      queues: ['HighPriorityQueue', 'NormalPriorityQueue', 'LowPriorityQueue', ...SsoConfig.ssoResque.dynamicQueues],
      moduleMapData: SsoResqueTaskMapper,
    }),
  ],
})
app.launch()
