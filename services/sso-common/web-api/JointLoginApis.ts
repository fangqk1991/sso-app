import { Api } from '@fangcha/swagger'

export const JointLoginApis = {
  FeishuLogin: {
    method: 'GET',
    route: '/api/v1/joint-login/feishu/login',
    description: '飞书登录信息准备',
  },
  FeishuCallback: {
    method: 'GET',
    route: '/api/v1/joint-login/feishu/callback',
    description: '飞书联合回调',
  } as Api,
}
