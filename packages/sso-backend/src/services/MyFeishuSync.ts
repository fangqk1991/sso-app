import { FeishuSync } from '@fangcha/feishu-sdk'
import { MyFeishuServer } from './MyFeishuServer'
import { MyFeishuSdkClient } from './MyFeishuSdkClient'
import { FeishuBot } from '@fangcha/bot-kit'
import { SsoConfig } from '../SsoConfig'

const feishuBot = new FeishuBot({})
feishuBot.setRetainedBotKey(SsoConfig.feishuSyncNotifyBotKey)

export const MyFeishuSync = new FeishuSync({
  feishuServer: MyFeishuServer,
  feishuClient: MyFeishuSdkClient,
  botCore: feishuBot,
})
