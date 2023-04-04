import { FeishuClient } from '@fangcha/feishu-sdk'
import { SsoConfig } from '../SsoConfig'
import { CustomRequestFollower } from '@fangcha/backend-kit'

export const MyFeishuSdkClient = new FeishuClient(SsoConfig.FeishuSDK, CustomRequestFollower)
