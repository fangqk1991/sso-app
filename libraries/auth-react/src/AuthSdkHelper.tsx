import { MyRequest } from './services/MyRequest'
import { LoginApis } from '@fangcha/sso-models'
import { AccountSimpleParams } from '@fangcha/account-models'
import { KitAuthApis } from '@fangcha/backend-kit/lib/apis'

export class AuthSdkHelper {
  public static forClientSDK = true

  public static async submitLogin(params: AccountSimpleParams) {
    if (!this.forClientSDK) {
      const request = MyRequest(LoginApis.LoginWithEmail)
      request.setBodyData(params)
      await request.quickSend()
      return
    }
    const request = MyRequest(KitAuthApis.Login)
    request.setBodyData(params)
    await request.quickSend()
  }

  public static logoutUrl() {
    if (!this.forClientSDK) {
      return LoginApis.Logout.route
    }
    return KitAuthApis.RedirectLogout.route
  }
}
