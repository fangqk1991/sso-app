import { Api, makeSwaggerBodyDataParameters } from '@fangcha/swagger'
import { NotificationSwaggerModelData } from '../user-models/swagger'

export const OpenNotificationApis = {
  WechatTemplateMessagesNotify: {
    method: 'POST',
    route: '/api/v1/notification/wechat-template-messages',
    description: '根据工号查询员工信息',
    parameters: makeSwaggerBodyDataParameters(NotificationSwaggerModelData.Swagger_NotificationParams),
  } as Api,
}
