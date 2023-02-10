import { SsoClientModel } from '@fangcha/sso-models'

export class ClientUtils {
  public static init_clientModel(): SsoClientModel {
    return {
      clientId: '',
      name: '',
      clientSecret: '',
      autoGranted: 0,
      isPartner: 0,
      isEnabled: 0,
      accessTokenLifeTime: 0,
      refreshTokenLifeTime: 0,
      grantList: [],
      scopeList: [],
      eventList: [],
      redirectUriList: [],
      createTime: '',
      updateTime: '',
      powerUsers: [],
      notifyUrl: '',
    }
  }
}
