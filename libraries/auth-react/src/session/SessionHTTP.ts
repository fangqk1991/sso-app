import { MyRequest } from '../services/MyRequest'
import { RetainedSessionApis, SessionInfo } from '@fangcha/app-models'

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
