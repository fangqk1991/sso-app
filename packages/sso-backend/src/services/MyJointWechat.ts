import { CustomRequestFollower } from '@fangcha/backend-kit'
import { SsoConfig } from '../SsoConfig'
import { JointWechatProxy } from './wechat/JointWechatProxy'

export const MyJointWechat = new JointWechatProxy(SsoConfig.JointLogin.Wechat, CustomRequestFollower)
