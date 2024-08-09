import { Api } from '@fangcha/swagger'

export const OpenUserApis = {
  WechatSubscriptionCheck: {
    method: 'POST',
    route: '/api/v1/user/:accountUid/check-wechat-mp-subscription',
    description: '检查是否订阅服务号',
  } as Api,
}
