import { Api } from '@fangcha/swagger'

export const OpenNotificationApis = {
  WechatTemplateMessagesNotify: {
    method: 'POST',
    route: '/api/v1/notification/wechat-template-messages',
    description: '根据工号查询员工信息',
  } as Api,
}
