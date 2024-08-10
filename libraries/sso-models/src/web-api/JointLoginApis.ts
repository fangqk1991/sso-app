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
  GoogleLogin: {
    method: 'GET',
    route: '/api/v1/joint-login/google/login',
    description: 'Google 登录跳转',
  },
  GoogleCallback: {
    method: 'GET',
    route: '/api/v1/joint-login/google/callback',
    description: 'Google 联合回调',
  } as Api,
  WechatLoginPrepare: {
    method: 'POST',
    route: '/api/v0/joint-login/wechat/prepare',
    description: '微信登录信息准备',
  },
  WechatLogin: {
    method: 'GET',
    route: '/api/v1/joint-login/wechat/login',
    description: 'Wechat 登录跳转',
  },
  WechatMPLogin: {
    method: 'GET',
    route: '/api/v1/joint-login/wechat/mp-login',
    description: 'Wechat MP 登录跳转',
  },
  WechatCallback: {
    method: 'GET',
    route: '/api/v1/joint-login/wechat/callback',
    description: 'Wechat 联合回调',
  } as Api,
}
