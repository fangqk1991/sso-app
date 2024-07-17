import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { ApiOptions, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import { WeixinBaseConfig } from './WeixinBaseConfig'
import { WeixinTokenKeeper } from './WeixinTokenKeeper'
import AppError from '@fangcha/app-error'
import { WeixinMpApis } from './WeixinMpApis'
import { MpTemplate, MpTemplateMsgParams, WeixinMpUser } from './WeixinMpModels'
import assert from '@fangcha/assert'

export class WeixinMpProxy extends ServiceProxy<WeixinBaseConfig> {
  protected _tokenKeeper: WeixinTokenKeeper

  constructor(config: WeixinBaseConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._tokenKeeper = new WeixinTokenKeeper(config, observerClass)
  }

  public async makeRequest(commonApi: ApiOptions) {
    const accessToken = await this._tokenKeeper.requireAccessToken()
    const request = axiosBuilder()
      .setBaseURL(this._config.baseUrl)
      .addBeforeExecuteHandler(() => {
        request.addQueryParams({
          access_token: accessToken,
        })
      })
      .setApiOptions(commonApi)
      .setResponse200Checker((responseData: { errcode: number; errmsg: string }) => {
        if (responseData.errcode) {
          const errorPrefix = `API[${commonApi.description}] error:`
          throw new AppError(`${errorPrefix} ${responseData.errmsg} [${responseData.errcode}]`, 400, responseData)
        }
      })
    this.onRequestMade(request)
    return request
  }

  public async getOpenIdList() {
    let openIdList: string[] = []
    let finished = false
    let next_openid = ''
    while (!finished) {
      const pageData = await this.getUserPageData(next_openid)
      if (pageData.count === 0) {
        finished = true
      } else {
        openIdList = openIdList.concat(pageData.data.openid)
        next_openid = pageData.next_openid
      }
    }
    return openIdList
  }

  public async getUserPageData(next_openid?: string) {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.UserPageDataGet))
    request.setQueryParams({
      next_openid: next_openid,
    })
    return await request.quickSend<{
      total: number
      count: number
      data: {
        openid: string[]
      }
      next_openid: string
    }>()
  }

  public async getUserInfo(openid: string) {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.UserInfoGet))
    request.setQueryParams({
      openid: openid,
      lang: 'zh_CN',
    })
    return await request.quickSend<WeixinMpUser>()
  }

  public async getUserInfosBatch(openidList: string[]) {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.UserInfosGetBatch))
    request.setBodyData({
      user_list: openidList.map((openid) => ({
        openid: openid,
        lang: 'zh_CN',
      })),
    })
    const response = await request.quickSend<{
      user_info_list: WeixinMpUser[]
    }>()
    return response.user_info_list
  }

  public async getIndustryInfo() {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.IndustryInfoGet))
    const response = await request.quickSend<{
      primary_industry: { first_class: string; second_class: string }
      secondary_industry: { first_class: string; second_class: string }
    }>()
    return response
  }

  public async getAllTemplates() {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.AllTemplatesGet))
    const response = await request.quickSend<{
      template_list: MpTemplate[]
    }>()
    return response.template_list
  }

  public async sendTemplateMessage(params: MpTemplateMsgParams) {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.TemplateMessageSend))
    request.setBodyData(params)
    const response = await request.quickSend<{
      errcode: number // 0
      errmsg: string // 'ok'
      msgid: number // 200228332
    }>()
    assert.ok(response.errcode === 0, `[${response.errcode}] ${response.errmsg}`)
  }

  public async createMenu(data: any) {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.MenuCreate))
    request.setBodyData(data)
    const response = await request.quickSend<{
      errcode: number // 0
      errmsg: string // 'ok'
      msgid: number // 200228332
    }>()
    assert.ok(response.errcode === 0, `[${response.errcode}] ${response.errmsg}`)
  }

  public async getMenuInfo() {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.MenuInfoGet))
    const response = await request.quickSend<{
      menu: {
        menuid: number
      }
      conditionalmenu: {
        menuid: number
      }[]
    }>()
    return response
  }

  public async deleteMenu() {
    const request = await this.makeRequest(new CommonAPI(WeixinMpApis.MenuDelete))
    const response = await request.quickSend<{
      errcode: number // 0
      errmsg: string // 'ok'
      msgid: number // 200228332
    }>()
    assert.ok(response.errcode === 0, `[${response.errcode}] ${response.errmsg}`)
  }
}
