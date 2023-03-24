import { ServiceProxy } from '@fangcha/app-request-extensions'
import { FeishuConfig } from './FeishuConfig'
import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { TenantAccessTokenResponse } from './FeishuModels'

const FeishuApis = {
  TenantAccessTokenRequest: {
    method: 'POST',
    route: '/open-apis/auth/v3/tenant_access_token/internal',
    description: '自建应用获取 tenant_access_token',
  },
}

export class FeishuClient extends ServiceProxy<FeishuConfig> {
  // constructor(config: FeishuConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
  //   super(config, observerClass)
  // }

  public makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder()
      .setBaseURL(this._config.urlBase)
      // .addHeader('Authorization', this._authorization)
      .setApiOptions(commonApi)
      .setTimeout(15000)
    this.onRequestMade(request)
    return request
  }

  public async requestTenantAccessToken() {
    const request = axiosBuilder()
      .setBaseURL(this._config.urlBase)
      .setApiOptions(FeishuApis.TenantAccessTokenRequest)
      // .addHeader('Authorization', this._authorization)
      .setTimeout(15000)
    this.onRequestMade(request)
    request.setBodyData({
      app_id: this._config.appid,
      app_secret: this._config.appSecret,
    })
    const response = (await request.quickSend()) as TenantAccessTokenResponse
    return response.tenant_access_token
  }
}
