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
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html#1
   */
  IndustryInfoGet: {
    method: 'GET',
    route: '/cgi-bin/template/get_industry',
    description: '获取设置的行业信息',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html#%E8%8E%B7%E5%8F%96%E6%A8%A1%E6%9D%BF%E5%88%97%E8%A1%A8
   */
  AllTemplatesGet: {
    method: 'GET',
    route: '/cgi-bin/template/get_all_private_template',
    description: '获取模板列表',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html#%E5%8F%91%E9%80%81%E6%A8%A1%E6%9D%BF%E6%B6%88%E6%81%AF
   */
  TemplateMessageSend: {
    method: 'POST',
    route: '/cgi-bin/message/template/send',
    description: '发送模板消息',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html
   */
  MenuCreate: {
    method: 'POST',
    route: '/cgi-bin/menu/create',
    description: '创建菜单',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Getting_Custom_Menu_Configurations.html
   */
  MenuInfoGet: {
    method: 'GET',
    route: '/cgi-bin/menu/get',
    description: '获取自定义菜单配置',
  },
  /**
   * https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Deleting_Custom-Defined_Menu.html
   */
  MenuDelete: {
    method: 'GET',
    route: '/cgi-bin/menu/delete',
    description: '删除当前使用的自定义菜单',
  },
}
