import { FeishuSync } from '@fangcha/feishu-sdk'
import { MyFeishuServer } from './MyFeishuServer'
import { MyFeishuSdkClient } from './MyFeishuSdkClient'

export const MyFeishuSync = new FeishuSync(MyFeishuServer, MyFeishuSdkClient)
