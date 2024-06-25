import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { ChannelTask } from '@fangcha/tools'
import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { WeixinMpApis } from './WeixinMpApis'
import { WeixinMpConfig } from './WeixinMpConfig'
import AppError from '@fangcha/app-error'

export class WeixinTokenKeeper extends ServiceProxy<WeixinMpConfig> {
  private _accessToken: string = ''
  private _expireTs: number = 0
  private _refreshTokenTask: ChannelTask<string>

  constructor(config: WeixinMpConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)

    this._refreshTokenTask = new ChannelTask(async () => {
      // const request = this.makeRequest(WeixinMpApis.AccessTokenGet)
      // request.setQueryParams({
      //   grant_type: 'client_credential',
      //   appid: this._config.appid,
      //   secret: this._config.secret,
      // })
      const request = this.makeRequest(WeixinMpApis.StableAccessTokenGet)
      request.setBodyData({
        grant_type: 'client_credential',
        appid: this._config.appid,
        secret: this._config.secret,
      })
      request.setResponse200Checker((responseData: { errcode: number; errmsg: string }) => {
        if (responseData.errcode) {
          const errorPrefix = `API[获取 accessToken] error:`
          throw new AppError(`${errorPrefix} ${responseData.errmsg} [${responseData.errcode}]`, 400, responseData)
        }
      })
      this.onRequestMade(request)
      const response = (await request.quickSend()) as {
        access_token: string
        expires_in: number // 单位: 秒
      }
      this._accessToken = response.access_token
      this._expireTs = Date.now() + response.expires_in * 1000
      return this._accessToken
    })
  }

  public makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder().setBaseURL(this._config.baseUrl).setApiOptions(commonApi).setTimeout(15000)
    this.onRequestMade(request)
    return request
  }

  public async refreshAccessToken() {
    return this._refreshTokenTask.execute()
  }

  public async requireAccessToken() {
    // 到期时间不足 120s
    if (this._expireTs - Date.now() < 120000) {
      await this.refreshAccessToken()
    }
    return this._accessToken
  }
}
