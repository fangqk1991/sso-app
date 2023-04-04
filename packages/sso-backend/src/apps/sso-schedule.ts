import { FangchaApp } from '@fangcha/backend-kit'
import { ScheduleSdkPlugin } from '@fangcha/backend-kit/lib/schedule'
import { GlobalAppConfig } from 'fc-config'
import { SsoConfig } from '../SsoConfig'
import { SsoResque } from '../services/SsoResque'

const app = new FangchaApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-schedule',
  wecomBotKey: SsoConfig.wecomBotKey,
  feishuBotKey: SsoConfig.feishuBotKey,

  plugins: [
    ScheduleSdkPlugin([
      {
        name: '同步组织架构信息',
        // 每 10 分钟一次
        cronRule: '*/10 * * * *',
        handler: async () => {
          await SsoResque.enqueue_FeishuDepartmentSyncTask()
        },
      },
    ]),
  ],
})
app.launch()
