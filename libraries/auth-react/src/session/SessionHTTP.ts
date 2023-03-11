import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { MyRequest } from '../services/MyRequest'

export interface SessionUserInfo {
  email: string
  isAdmin?: boolean
  permissionKeyMap: {
    [p: string]: 1
  }
  [p: string]: any
}

export class SessionHTTP {
  public static async getSessionInfo<Config = {}>() {
    return await MyRequest(RetainedSessionApis.SessionInfoGet).quickSend<SessionInfo<Config>>()
  }

  public static async getUserInfo() {
    return await MyRequest(RetainedSessionApis.UserInfoGet).quickSend<SessionUserInfo>()
  }
}
