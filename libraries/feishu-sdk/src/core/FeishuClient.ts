import { ServiceProxy } from '@fangcha/app-request-extensions'
import { FeishuConfig } from './FeishuConfig'
import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { EmployeePageDataResponse, FeishuEmployee, TenantAccessTokenResponse } from './FeishuModels'

const FeishuApis = {
  TenantAccessTokenRequest: {
    method: 'POST',
    route: '/open-apis/auth/v3/tenant_access_token/internal',
    description: '自建应用获取 tenant_access_token',
  },
  EmployeePageDataGet: {
    method: 'GET',
    route: '/open-apis/ehr/v1/employees',
    description: '批量获取员工花名册信息',
  },
}

export class FeishuClient extends ServiceProxy<FeishuConfig> {
  // constructor(config: FeishuConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
  //   super(config, observerClass)
  // }

  public makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder()
      .setBaseURL(this._config.urlBase)
      .addHeader('Authorization', `Bearer t-g1043oe2QO7PMSOQ5ZKFOLCBTL7EMXAKKNHRFNW3`)
      .setApiOptions(commonApi)
      .setTimeout(15000)
    this.onRequestMade(request)
    return request
  }

  public async requestTenantAccessToken() {
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
    return response.tenant_access_token
  }

  public async getEmployeePageData(params: { page_token?: string; page_size?: number } = {}) {
    const request = this.makeRequest(FeishuApis.EmployeePageDataGet)
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
