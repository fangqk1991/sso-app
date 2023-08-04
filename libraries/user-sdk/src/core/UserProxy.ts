import { CommonAPI } from '@fangcha/app-request'
import { AppFullInfo, FeishuUserModel } from '@fangcha/account-models'
import { UserServiceProtocol } from './UserServiceProtocol'
import { BasicAuthProxy, RequestFollower } from '@fangcha/app-request-extensions'
import { Api, buildSwaggerSchema } from '@fangcha/swagger'

const OpenAppApis = {
  AppFullInfo: {
    method: 'GET',
    route: '/api/v1/app-full-info',
    description: '应用完整信息',
    parameters: [],
  } as Api,
  AppVersionGet: {
    method: 'GET',
    route: '/api/v1/app-version',
    description: '获取应用版本号',
    parameters: [],
    responseDemo: 0,
  } as Api,
}

const OpenStaffApis = {
  SearchStaffsByEmployeeIds: {
    method: 'POST',
    route: '/api/v1/staff/search-staffs-by-employee-ids',
    description: '根据工号查询员工信息',
    parameters: [
      {
        name: 'bodyData',
        type: 'object',
        in: 'body',
        schema: buildSwaggerSchema(['XXX']),
      },
    ],
  } as Api,
}

export class UserProxy extends BasicAuthProxy implements UserServiceProtocol {
  public async getAppFullInfo() {
    const request = this.makeRequest(new CommonAPI(OpenAppApis.AppFullInfo))
    return (await request.quickSend()) as AppFullInfo
  }

  public async getAppVersion() {
    const request = this.makeRequest(new CommonAPI(OpenAppApis.AppVersionGet))
    const observer = request['_observer'] as RequestFollower
    if (observer) {
      observer.useLogger = false
    }
    return Number(await request.quickSend())
  }

  public async searchStaffsByEmployeeIds(employeeIds: string[]) {
    const request = this.makeRequest(new CommonAPI(OpenStaffApis.SearchStaffsByEmployeeIds))
    request.setBodyData(employeeIds)
    return (await request.quickSend()) as { [employeeId: string]: FeishuUserModel }
  }
}
