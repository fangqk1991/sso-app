import { Api } from '@fangcha/swagger'

export const JointBindApis = {
  GoogleLoginBindGoto: {
    method: 'GET',
    route: '/api/v1/joint-bind/google/goto',
    description: 'Google 登录绑定',
  },
  WechatLoginBindGoto: {
    method: 'GET',
    route: '/api/v1/joint-bind/wechat/goto',
    description: 'Wechat 登录绑定',
  },
  FeishuLoginBindGoto: {
    method: 'GET',
    route: '/api/v1/joint-bind/feishu/goto',
    description: '飞书登录绑定',
  },
  JointLoginUnlink: {
    method: 'DELETE',
    route: '/api/v1/joint-bind/:carrierType',
    description: '解除绑定账号载体',
  } as Api,
}
