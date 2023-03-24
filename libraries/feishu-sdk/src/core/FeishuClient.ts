import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { FeishuConfig } from './FeishuConfig'
import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { EmployeePageDataResponse, FeishuEmployee } from './FeishuModels'
import { FeishuApis } from './FeishuApis'
import { FeishuTokenKeeper } from './FeishuTokenKeeper'

export class FeishuClient extends ServiceProxy<FeishuConfig> {
  private _tokenKeeper: FeishuTokenKeeper

  constructor(config: FeishuConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._tokenKeeper = new FeishuTokenKeeper(config, observerClass)
  }

  public async makeRequest(commonApi: ApiOptions) {
    const accessToken = await this._tokenKeeper.requireTenantAccessToken()
    const request = axiosBuilder()
      .setBaseURL(this._config.urlBase)
      .addHeader('Authorization', `Bearer ${accessToken}`)
      .setApiOptions(commonApi)
      .setTimeout(15000)
    this.onRequestMade(request)
    return request
  }

  public async getEmployeePageData(params: { page_token?: string; page_size?: number } = {}) {
    const request = await this.makeRequest(FeishuApis.EmployeePageDataGet)
    request.setQueryParams(params)
    const response = await request.quickSend<EmployeePageDataResponse>()
    return response.data
  }

  public async getAllEmployees() {
    let items: FeishuEmployee[] = []
    let finished = false
    let pageToken: any = undefined
    while (!finished) {
      const pageData = await this.getEmployeePageData({
        page_token: pageToken,
        page_size: 100,
      })
      items = items.concat(pageData.items)
      if (!pageData.has_more) {
        finished = true
      } else if (pageData.page_token) {
        pageToken = pageData.page_token
      }
    }
    return items
  }
}
