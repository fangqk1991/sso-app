import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { FeishuConfig } from './FeishuConfig'
import { axiosBuilder } from '@fangcha/app-request'
import { TenantAccessTokenResponse } from './FeishuModels'
import { FeishuApis } from './FeishuApis'
import { ChannelTask } from '@fangcha/tools'

export class FeishuTokenKeeper extends ServiceProxy<FeishuConfig> {
  public tenantAccessToken: string = ''
  public expireTs: number = 0
  private _refreshTokenTask: ChannelTask<string>

  constructor(config: FeishuConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._refreshTokenTask = new ChannelTask(async () => {
      const request = axiosBuilder()
        .setBaseURL(this._config.urlBase)
        .setApiOptions(FeishuApis.TenantAccessTokenRequest)
        .setTimeout(15000)
      this.onRequestMade(request)
      request.setBodyData({
        app_id: this._config.appid,
        app_secret: this._config.appSecret,
      })
      const response = (await request.quickSend()) as TenantAccessTokenResponse
      this.tenantAccessToken = response.tenant_access_token
      this.expireTs = Date.now() + response.expire * 1000
      return this.tenantAccessToken
    })
  }

  public async refreshTenantAccessToken() {
    return this._refreshTokenTask.execute()
  }

  public async requireTenantAccessToken() {
    // 到期时间不足 60s
    if (this.expireTs - Date.now() < 60000) {
      await this.refreshTenantAccessToken()
    }
    return this.tenantAccessToken
  }
}
