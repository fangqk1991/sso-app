import { __AppAccess } from '../auto-build/__AppAccess'
import { P_AccessInfo } from '@fangcha/account-models'
import { makeRandomStr, makeUUID } from '@fangcha/tools'

export class _AppAccess extends __AppAccess {
  public constructor() {
    super()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as P_AccessInfo
    data.appSecret = data.appSecret.substring(0, 4) + '**********'
    return data
  }

  public toJSON() {
    return this.modelForClient()
  }

  public fullModelInfo() {
    return this.fc_pureModel() as P_AccessInfo
  }

  public static async generateAppAccess(appid: string, author: string) {
    const feed = new this()
    feed.accessId = makeUUID()
    feed.appid = appid
    feed.appSecret = makeRandomStr(32)
    feed.author = author
    await feed.addToDB()
    return feed
  }
}
