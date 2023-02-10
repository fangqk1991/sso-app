import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { NotificationCenter } from 'notification-center-js'
import { CommonAppApis } from '@web/auth-common/core-api'
import { P_AppInfo, P_AppParams } from '@fangcha/account-models'

class _UserHTTP {
  public async getAppInfo(appid?: string) {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppInfoGet, appid || '_'))
    return request.quickSend<P_AppInfo>()
  }

  public async updateApp(params: Partial<P_AppParams>, appid?: string) {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppUpdate, appid || '_'))
    request.setBodyData(params)
    await request.quickSend()
    NotificationCenter.defaultCenter().postNotification('__onAppInfoChanged')
  }
}

export const UserHTTP = new _UserHTTP()
