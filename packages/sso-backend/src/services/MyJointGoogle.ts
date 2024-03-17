import { CustomRequestFollower } from '@fangcha/backend-kit'
import { SsoConfig } from '../SsoConfig'
import { JointGoogleProxy } from './google/JointGoogleProxy'

export const MyJointGoogle = new JointGoogleProxy(SsoConfig.JointLogin.Google, CustomRequestFollower)
if (SsoConfig.OverseasProxy) {
  MyJointGoogle.setProxy(SsoConfig.OverseasProxy as any)
}
