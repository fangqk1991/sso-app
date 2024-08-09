import { CommonAPI } from '@fangcha/app-request'
import { AppFullInfo, FeishuUserModel } from '@fangcha/account-models'
import { UserServiceProtocol } from './UserServiceProtocol'
import { BasicAuthProxy, RequestFollower } from '@fangcha/app-request-extensions'
import { Api, buildSwaggerSchema } from '@fangcha/swagger'
import { NotificationBatchNotifyParams, NotificationParams } from './NotificationModels'

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

const OpenNotificationApis = {
  WechatTemplateMessagesNotify: {
    method: 'POST',
    route: '/api/v1/notification/wechat-template-messages',
    description: '推送微信模板消息',
  } as Api,
  WechatTemplateMessagesNotifyBatch: {
    method: 'POST',
    route: '/api/v1/notification/wechat-template-messages-batch-notify',
    description: '(批量)推送微信模板消息',
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
  UserGroupMembersGet: {
    method: 'GET',
    route: '/api/v1/user-group/:groupId/member',
    description: '查询指定组成员信息',
  } as Api,
}

const OpenUserApis = {
  WechatSubscriptionCheck: {
    method: 'POST',
    route: '/api/v1/user/:accountUid/check-wechat-mp-subscription',
    description: '检查是否订阅服务号',
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

  public async getUserGroupMembers(groupId: string) {
    const request = this.makeRequest(new CommonAPI(OpenStaffApis.UserGroupMembersGet, groupId))
    return (await request.quickSend()) as {
      unionId: string
      employeeId: string
      name: string
    }[]
  }

  public async pushNotification(params: NotificationParams) {
    const request = this.makeRequest(new CommonAPI(OpenNotificationApis.WechatTemplateMessagesNotify))
    request.setBodyData(params)
    await request.quickSend()
  }

  public async pushNotificationBatch(params: NotificationBatchNotifyParams) {
    const request = this.makeRequest(new CommonAPI(OpenNotificationApis.WechatTemplateMessagesNotifyBatch))
    request.setBodyData(params)
    await request.quickSend()
  }

  public async checkAccountWechatSubscription(accountUid: string) {
    const request = this.makeRequest(new CommonAPI(OpenUserApis.WechatSubscriptionCheck, accountUid))
    await request.quickSend()
  }
}
