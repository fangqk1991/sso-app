import { ApiOptions, AxiosBuilder, axiosBuilder } from '@fangcha/app-request'
import { JointWechatApis } from './JointWechatApis'
import AppError from '@fangcha/app-error'
import { JointWechatConfig, WechatTokenData, WechatUserInfo } from './JointWechatModels'
import { ServiceProxy } from '@fangcha/app-request-extensions'
import * as qs from 'query-string'

/**
 * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
 */
export class JointWechatProxy extends ServiceProxy<JointWechatConfig> {
  private makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder().setBaseURL(this._config.baseUrl).setApiOptions(commonApi).setTimeout(15000)
    this.onRequestMade(request)
    return request
  }

  public mp_getAuthorizeUri(state?: string) {
    const options = this._config

    const queryString = qs.stringify({
      appid: options.appid,
      redirect_uri: options.redirectUri,
      response_type: 'code',
      scope: 'snsapi_userinfo',
      state: state || '',
    })
    return `https://open.weixin.qq.com/connect/oauth2/authorize?${queryString}#wechat_redirect`
  }

  public getAuthorizeUri(state?: string) {
    const options = this._config

    const queryString = qs.stringify({
      appid: options.appid,
      redirect_uri: options.redirectUri,
      response_type: 'code',
      scope: 'snsapi_login',
      state: state || '',
    })
    return `https://open.weixin.qq.com/connect/qrconnect?${queryString}#wechat_redirect`
  }

  private async sendRequest<T>(request: AxiosBuilder): Promise<T> {
    const response = await request.quickSend()
    if (response['errcode']) {
      throw new AppError(`API[${request.commonApi.description}]: ${response['errcode']} ${response['errmsg']}`)
    }
    return response
  }

  public async getAccessTokenData(code: string) {
    const request = this.makeRequest(JointWechatApis.AccessTokenGet)
    request.setQueryParams({
      appid: this._config.appid,
      secret: this._config.secret,
      code: code,
      grant_type: 'authorization_code',
    })
    return await this.sendRequest<WechatTokenData>(request)
  }

  public async getUserInfo(accessToken: string) {
    const request = this.makeRequest(JointWechatApis.UserInfoGet)
    request.setQueryParams({
      openid: 'OPENID',
      access_token: accessToken,
    })
    return await this.sendRequest<WechatUserInfo>(request)
  }

  public async getUserInfoFromAuthorizationCode(code: string) {
    const tokenData = await this.getAccessTokenData(code)
    return this.getUserInfo(tokenData.access_token)
  }
}
