import { Api } from '@fangcha/swagger'

export const JointBindApis = {
  WechatLoginBindPrepare: {
    method: 'GET',
    route: '/api/v1/joint-bind/wechat/prepare',
    description: 'Wechat 登录绑定',
  },
  JointLoginUnlink: {
    method: 'DELETE',
    route: '/api/v1/joint-bind/:carrierType',
    description: '解除绑定账号载体',
  } as Api,
}
