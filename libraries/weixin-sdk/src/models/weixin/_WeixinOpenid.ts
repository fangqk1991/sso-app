import { __WeixinOpenid } from '../auto-build/__WeixinOpenid'

interface Params {
  openid: string
  unionId: string
  appid: string
}

export class _WeixinOpenid extends __WeixinOpenid {
  public constructor() {
    super()
  }

  public static recordOpenid(options: Params) {
    const feed = new this()
    feed.openid = options.openid
    feed.unionId = options.unionId
    feed.appid = options.appid
    feed.strongAddToDB().catch((err) => {
      console.error(err)
    })
  }
}
