import { FCDatabase } from 'fc-sql'
import { _WeixinUser } from '../../models/weixin/_WeixinUser'
import { _WeixinOpenid } from '../../models/weixin/_WeixinOpenid'

interface Options {
  database: FCDatabase

  // Default: fc_weixin_user
  tableName_WeixinUser?: string

  // Default: fc_weixin_openid
  tableName_WeixinOpenid?: string
}

export class WeixinServer {
  public readonly options: Options
  public readonly database: FCDatabase

  public readonly WeixinUser!: { new (): _WeixinUser } & typeof _WeixinUser
  public readonly WeixinOpenid!: { new (): _WeixinOpenid } & typeof _WeixinOpenid

  public readonly tableName_WeixinUser: string
  public readonly tableName_WeixinOpenid: string

  constructor(options: Options) {
    this.options = options

    this.database = options.database

    this.tableName_WeixinUser = options.tableName_WeixinUser || 'fc_weixin_user'
    this.tableName_WeixinOpenid = options.tableName_WeixinOpenid || 'fc_weixin_openid'

    class WeixinUser extends _WeixinUser {}
    WeixinUser.addStaticOptions({
      database: options.database,
      table: this.tableName_WeixinUser,
    })
    this.WeixinUser = WeixinUser

    class WeixinOpenid extends _WeixinOpenid {}
    WeixinOpenid.addStaticOptions({
      database: options.database,
      table: this.tableName_WeixinOpenid,
    })
    this.WeixinOpenid = WeixinOpenid
  }
}
