import { FangchaApp } from '@fangcha/backend-kit'
import { GlobalAppConfig } from 'fc-config'
import { SsoResqueTaskMapper } from './resque'
import { SsoConfig } from '../SsoConfig'
import { ResqueSdkPlugin } from '@fangcha/resque-sdk'

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
