import { Api } from '@fangcha/swagger'

export const JointBindApis = {
  WechatLoginBindGoto: {
    method: 'GET',
    route: '/api/v1/joint-bind/wechat/goto',
    description: 'Wechat 登录绑定',
  },
  JointLoginUnlink: {
    method: 'DELETE',
    route: '/api/v1/joint-bind/:carrierType',
    description: '解除绑定账号载体',
  } as Api,
}
