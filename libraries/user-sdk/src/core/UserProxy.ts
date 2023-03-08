import { CommonAPI } from '@fangcha/app-request'
import { BasicAuthProxy, RequestFollower } from '@fangcha/tools/lib/request'
import { Api } from '@fangcha/swagger'
import { AppFullInfo } from '@fangcha/account-models'

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

export class UserProxy extends BasicAuthProxy {
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
}
