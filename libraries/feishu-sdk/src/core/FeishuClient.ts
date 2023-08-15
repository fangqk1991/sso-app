import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { FeishuConfig } from './FeishuConfig'
import { ApiOptions, AxiosBuilder, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import {
  FeishuDepartmentResponse,
  FeishuPageDataResponse,
  FeishuResponse,
  FeishuUserToken,
  Raw_FeishuDepartment,
  Raw_FeishuDepartmentTree,
  Raw_FeishuEmployee,
  Raw_FeishuUser,
} from './RawFeishuModels'
import { FeishuApis } from './FeishuApis'
import { FeishuTokenKeeper } from './FeishuTokenKeeper'
import { GuardPerformer } from '@fangcha/tools'
import AppError from '@fangcha/app-error'

export class FeishuClient extends ServiceProxy<FeishuConfig> {
  private _tokenKeeper: FeishuTokenKeeper

  constructor(config: FeishuConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._tokenKeeper = new FeishuTokenKeeper(config, observerClass)
  }

  public makeAuthorizeUri(options: { redirectUri: string; state: string }) {
    const request = new AxiosBuilder()
      .setBaseURL(this._config.urlBase)
      .setApiOptions(FeishuApis.AuthorizeUri)
      .setQueryParams({
        app_id: this._config.appid,
        redirect_uri: options.redirectUri,
        state: options.state,
      })
    return request.getRequestUrl()
  }

  public async makeRequest(commonApi: ApiOptions) {
    const accessToken = await this._tokenKeeper.requireTenantAccessToken()
    const request = axiosBuilder()
      .setBaseURL(this._config.urlBase)
      .addHeader('Authorization', `Bearer ${accessToken}`)
      .setApiOptions(commonApi)
      .setTimeout(15000)
    request.setErrorParser((client, error) => {
      let message = error.message
      if (client.axiosError?.response?.data && typeof client.axiosError?.response.data === 'object') {
        const data = client.axiosError?.response.data as FeishuResponse<any>
        error.extras = data
        message = `${data.msg}[${data.code}]`
      }
      const errorPrefix = `API[${commonApi.description}] error:`
      return new AppError(`${errorPrefix} ${message}`, error.statusCode, error.extras)
    })
    this.onRequestMade(request)
    return request
  }

  public async getUserToken(code: string) {
    const request = await this.makeRequest(FeishuApis.UserAccessTokenRequest)
    request.setBodyData({
      grant_type: 'authorization_code',
      code: code,
    })
    const response = await request.quickSend<FeishuResponse<FeishuUserToken>>()
    if (response.code !== 0) {
      const message = `${response.msg}[${response.code}]`
      const errorPrefix = `API[${FeishuApis.UserAccessTokenRequest.description}] error:`
      throw new AppError(`${errorPrefix} ${message}`, 400, response)
    }
    return response.data
  }

  public async getAllPageItems<T>(
    handler: (params: { page_token: string; page_size: number }) => Promise<FeishuPageDataResponse<T>>
  ) {
    let items: T[] = []
    let finished = false
    let pageToken: any = undefined
    while (!finished) {
      const pageResult = await handler({
        page_token: pageToken,
        page_size: 50,
      })
      const pageData = pageResult.data
      items = items.concat(pageData.items || [])
      if (!pageData.has_more) {
        finished = true
      } else if (pageData.page_token) {
        pageToken = pageData.page_token
      }
    }
    return items
  }

  public async getAllEmployees(
    params: {
      user_id_type?: 'open_id' | 'union_id' | 'user_id'
      view?: 'basic' | 'full'
    } = {}
  ) {
    return this.getAllPageItems<Raw_FeishuEmployee>(async (pageParams) => {
      return await GuardPerformer.perform(async () => {
        const request = await this.makeRequest(FeishuApis.EmployeePageDataGet)
        request.setQueryParams({
          ...params,
          ...pageParams,
          page_size: 100,
        })
        return await request.quickSend()
      })
    })
  }

  public async getDepartmentAllMembers(openDepartmentId: string) {
    return this.getAllPageItems<Raw_FeishuUser>(async (pageParams) => {
      return await GuardPerformer.perform(async () => {
        const request = await this.makeRequest(FeishuApis.DepartmentMemberPageDataGet)
        request.setQueryParams({
          department_id_type: 'open_department_id',
          department_id: openDepartmentId,
          user_id_type: 'union_id',
          ...pageParams,
          page_size: 50,
        })
        return await request.quickSend()
      })
    })
  }

  public async getDepartmentInfo(departmentId: string) {
    const request = await this.makeRequest(new CommonAPI(FeishuApis.DepartmentInfoGet, departmentId))
    request.setQueryParams({
      user_id_type: 'union_id',
      department_id_type: 'open_department_id',
    })
    const response = await request.quickSend<FeishuDepartmentResponse>()
    return response.data.department
  }

  public async getDepartmentChildren(openDepartmentId: string) {
    return this.getAllPageItems<Raw_FeishuDepartment>(async (pageParams) => {
      return await GuardPerformer.perform(async () => {
        const request = await this.makeRequest(new CommonAPI(FeishuApis.DepartmentChildrenInfoGet, openDepartmentId))
        request.setQueryParams({
          user_id_type: 'union_id',
          department_id_type: 'open_department_id',
          ...pageParams,
          page_size: 50,
        })
        return await request.quickSend()
      })
    })
  }

  public async fillDepartmentTree(node: Raw_FeishuDepartmentTree) {
    const openDepartmentId = node.department.open_department_id
    const subDepartments = await this.getDepartmentChildren(openDepartmentId)
    node.children = subDepartments.map((item) => {
      return {
        department: item,
        path: `${node.path},${item.open_department_id}`,
        memberList: [],
        children: [],
      }
    })
    node.memberList = await this.getDepartmentAllMembers(openDepartmentId)
    for (const subNode of node.children) {
      await this.fillDepartmentTree(subNode)
    }
  }

  public async getDepartmentTree(departmentId = '0') {
    const department = await this.getDepartmentInfo(departmentId)
    const rootNode: Raw_FeishuDepartmentTree = {
      department: department,
      path: `${department.open_department_id}`,
      children: [],
      memberList: [],
    }
    await this.fillDepartmentTree(rootNode)
    return rootNode
  }
}
