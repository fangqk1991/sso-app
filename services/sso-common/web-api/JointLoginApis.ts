import { Api } from '@fangcha/swagger'

export const JointLoginApis = {
  FeishuLoginForCode: {
    method: 'GET',
    route: '/api/v1/joint-login/feishu/login-for-code',
    description: '飞书登录跳转 (调试 Code)',
  },
  FeishuCallbackForCode: {
    method: 'GET',
    route: '/api/v1/joint-login/feishu/callback-for-code',
    description: '飞书联合回调 (调试 Code)',
  } as Api,
  FeishuLogin: {
    method: 'GET',
    route: '/api/v1/joint-login/feishu/login',
    description: '飞书登录跳转',
  },
  FeishuCallback: {
    method: 'GET',
    route: '/api/v1/joint-login/feishu/callback',
    description: '飞书联合回调',
  } as Api,
}
