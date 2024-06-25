export const WeixinMpApis = {
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
   */
  AccessTokenGet: {
    method: 'GET',
    route: '/cgi-bin/token',
    description: '获取 accessToken',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/getStableAccessToken.html
   */
  StableAccessTokenGet: {
    method: 'POST',
    route: '/cgi-bin/stable_token',
    description: '获取 accessToken',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/User_Management/Getting_a_User_List.html
   */
  UserPageDataGet: {
    method: 'POST',
    route: '/cgi-bin/user/get',
    description: '获取用户列表',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/User_Management/Get_users_basic_information_UnionID.html
   */
  UserInfoGet: {
    method: 'GET',
    route: '/cgi-bin/user/info',
    description: '获取用户信息',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/User_Management/Get_users_basic_information_UnionID.html
   */
  UserInfosGetBatch: {
    method: 'POST',
    route: '/cgi-bin/user/info/batchget',
    description: '批量获取用户信息',
  },
}
