import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { FeishuConfig } from './FeishuConfig'
import { ApiOptions, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import {
  FeishuDepartment,
  FeishuDepartmentResponse,
  FeishuDepartmentTree,
  FeishuEmployee,
  FeishuPageDataResponse,
  FeishuUser,
} from './RawFeishuModels'
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

  public async getEmployeePageData(
    params: { user_id_type?: 'open_id' | 'union_id' | 'user_id'; page_token?: string; page_size?: number } = {}
  ) {
    const request = await this.makeRequest(FeishuApis.EmployeePageDataGet)
    request.setQueryParams(params)
    const response = await request.quickSend<FeishuPageDataResponse<FeishuEmployee>>()
    return response.data
  }

  public async getAllEmployees(params: { user_id_type?: 'open_id' | 'union_id' | 'user_id' } = {}) {
    let items: FeishuEmployee[] = []
    let finished = false
    let pageToken: any = undefined
    while (!finished) {
      const pageData = await this.getEmployeePageData({
        ...params,
        page_token: pageToken,
        page_size: 100,
      })
      items = items.concat(pageData.items || [])
      if (!pageData.has_more) {
        finished = true
      } else if (pageData.page_token) {
        pageToken = pageData.page_token
      }
    }
    return items
  }

  public async getDepartmentMemberPageData(
    openDepartmentId: string,
    params: {
      page_token?: string
      page_size?: number
    } = {}
  ) {
    const request = await this.makeRequest(FeishuApis.DepartmentMemberPageDataGet)
    request.setQueryParams({
      ...params,
      department_id_type: 'open_department_id',
      department_id: openDepartmentId,
      user_id_type: 'union_id',
    })
    const response = await request.quickSend<FeishuPageDataResponse<FeishuUser>>()
    return response.data
  }

  public async getDepartmentAllMembers(openDepartmentId: string) {
    let items: FeishuUser[] = []
    let finished = false
    let pageToken: any = undefined
    while (!finished) {
      const pageData = await this.getDepartmentMemberPageData(openDepartmentId, {
        page_token: pageToken,
        page_size: 50,
      })
      items = items.concat(pageData.items || [])
      if (!pageData.has_more) {
        finished = true
      } else if (pageData.page_token) {
        pageToken = pageData.page_token
      }
    }
    return items
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
    const request = await this.makeRequest(new CommonAPI(FeishuApis.DepartmentChildrenInfoGet, openDepartmentId))
    request.setQueryParams({
      user_id_type: 'union_id',
      department_id_type: 'open_department_id',
    })
    const response = await request.quickSend<FeishuPageDataResponse<FeishuDepartment>>()
    return response.data.items || []
  }

  public async fillDepartmentTree(node: FeishuDepartmentTree) {
    const openDepartmentId = node.department.open_department_id
    const subDepartments = await this.getDepartmentChildren(openDepartmentId)
    node.children = subDepartments.map((item) => {
      return {
        department: item,
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
    const rootNode: FeishuDepartmentTree = {
      department: department,
      children: [],
      memberList: [],
    }
    await this.fillDepartmentTree(rootNode)
    return rootNode
  }
}
