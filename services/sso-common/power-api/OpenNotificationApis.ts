import { Api, makeSwaggerBodyDataParameters } from '@fangcha/swagger'
import { NotificationSwaggerModelData } from '../user-models/swagger'

export const OpenNotificationApis = {
  WechatTemplateMessagesNotify: {
    method: 'POST',
    route: '/api/v1/notification/wechat-template-messages',
    description: '推送微信模板消息',
    parameters: makeSwaggerBodyDataParameters(NotificationSwaggerModelData.Swagger_NotificationParams),
  } as Api,
}
