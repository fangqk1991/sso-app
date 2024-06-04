export const JointWechatApis = {
  AccessTokenGet: {
    method: 'GET',
    route: '/sns/oauth2/access_token',
    description: '微信 AccessToken 获取',
  },
  UserInfoGet: {
    method: 'GET',
    route: '/sns/userinfo',
    description: '微信用户基本信息获取',
  },
}
