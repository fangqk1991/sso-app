import { LoginApis, WebAuthApis } from '@fangcha/sso-models'
import { AccountSimpleParams } from '@fangcha/account-models'
import { MyRequest } from './MyRequest'

export class AuthSdkHelper {
  public static forClientSDK = true
  public static defaultRedirectUri = '/profile'

  public static async submitLogin(params: AccountSimpleParams) {
    if (!this.forClientSDK) {
      const request = MyRequest(LoginApis.LoginWithEmail)
      request.setBodyData(params)
      await request.quickSend()
      return
    }
    const request = MyRequest(WebAuthApis.Login)
    request.setBodyData(params)
    await request.quickSend()
  }

  public static logoutUrl() {
    if (!this.forClientSDK) {
      return LoginApis.Logout.route
    }
    return WebAuthApis.RedirectLogout.route
  }
}
