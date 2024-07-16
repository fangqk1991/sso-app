import { CustomRequestFollower } from '@fangcha/backend-kit'
import { SsoConfig } from '../SsoConfig'
import { WeixinMpProxy } from '@fangcha/weixin-sdk'

export const MyMpWechatProxy = new WeixinMpProxy(SsoConfig.JointLogin.WechatMP, CustomRequestFollower)
