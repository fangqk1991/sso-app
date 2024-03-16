import { JointGoogleApis } from './JointGoogleApis'
import { GoogleUserInfo } from './JointGoogleModels'
import { OAuthClient, OAuthToken } from '@fangcha/web-auth-sdk'

export class JointGoogleProxy extends OAuthClient {
  public async getUserInfo(idToken: string) {
    const request = this.makeRequest(JointGoogleApis.UserInfoGet)
    request.setBaseURL('https://www.googleapis.com')
    request.setQueryParams({
      id_token: idToken,
    })
    const response = await request.quickSend()
    return response as GoogleUserInfo
  }

  public async getUserInfoFromAuthorizationCode(code: string) {
    const tokenData = (await this.getAccessTokenData(code)) as OAuthToken & { id_token: string }
    return this.getUserInfo(tokenData.id_token)
  }
}
