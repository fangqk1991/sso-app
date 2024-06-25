export interface WeixinMpUser {
  subscribe: 1 | 0
  openid: string
  nickname: ''
  sex: 0
  language: string // 'zh_CN',
  city: string
  province: string
  country: string
  headimgurl: string
  subscribe_time: number // 1526901755,
  unionid: string
  remark: string
  groupid: number
  tagid_list: number[]
  subscribe_scene: string // 返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索，ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，ADD_SCENE_PROFILE_LINK 图文页内名称点击，ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，ADD_SCENE_PAID 支付后关注，ADD_SCENE_WECHAT_ADVERTISEMENT 微信广告，ADD_SCENE_REPRINT 他人转载，ADD_SCENE_LIVESTREAM 视频号直播，ADD_SCENE_CHANNELS 视频号，ADD_SCENE_WXA 小程序关注，ADD_SCENE_OTHERS 其他
  qr_scene: number // 0,
  qr_scene_str: string
}
