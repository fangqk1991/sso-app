import { MyRequest } from '../services/MyRequest'
import { RetainedSessionApis, SessionInfo, SessionUserInfo } from '@fangcha/app-models'

export class SessionHTTP {
  public static async getSessionInfo<Config = {}>() {
    return await MyRequest(RetainedSessionApis.SessionInfoGet).quickSend<SessionInfo<Config>>()
  }

  public static async getUserInfo() {
    return await MyRequest(RetainedSessionApis.UserInfoGet).quickSend<SessionUserInfo>()
  }
}
