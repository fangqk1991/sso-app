import { __GroupAccess } from '../auto-build/__GroupAccess'
import { P_GroupAccessInfo } from '@web/auth-common/models'
import { makeRandomStr, makeUUID } from '@fangcha/tools'
import { Transaction } from 'sequelize'

export class _GroupAccess extends __GroupAccess {
  public constructor() {
    super()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as P_GroupAccessInfo
    data.groupSecret = data.groupSecret.substring(0, 4) + '**********'
    return data
  }

  public toJSON() {
    return this.modelForClient()
  }

  public fullModelInfo() {
    return this.fc_pureModel() as P_GroupAccessInfo
  }

  public static async generateGroupAccess(groupId: string, author: string, transaction?: Transaction) {
    const feed = new this()
    feed.accessId = makeUUID()
    feed.groupId = groupId
    feed.groupSecret = makeRandomStr(32)
    feed.author = author
    await feed.addToDB(transaction)
    return feed
  }
}
