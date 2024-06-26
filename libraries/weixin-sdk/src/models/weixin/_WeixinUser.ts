import { __WeixinUser } from '../auto-build/__WeixinUser'
import { WeixinMpUser } from '../../official-mp/WeixinMpModels'

export class _WeixinUser extends __WeixinUser {
  public constructor() {
    super()
  }

  public static recordUserInfo(userInfo: WeixinMpUser) {
    const feed = new this()
    feed.unionId = userInfo.unionid
    feed.officialOpenid = userInfo.openid
    feed.nickName = userInfo.nickname || ''
    feed.headImgUrl = userInfo.headimgurl || ''
    feed.strongAddToDB().catch((err) => {
      console.error(err)
    })
  }
}
