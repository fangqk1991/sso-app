import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'union_id',
  'official_openid',
  'nick_name',
  'head_img_url',
  'created_at',
  'updated_at',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'union_id',
  'official_openid',
  'nick_name',
  'head_img_url',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'official_openid',
  'nick_name',
  'head_img_url',
  'created_at',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'created_at',
  'updated_at',
]

const dbOptions = {
  table: 'fc_weixin_user',
  primaryKey: 'union_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __WeixinUser extends FeedBase {
  /**
   * @description [varchar(64)] 微信 union_id
   */
  public unionId!: string
  /**
   * @description [varchar(64)] 公众号 Open ID
   */
  public officialOpenid!: string | null
  /**
   * @description [varchar(255)]
   */
  public nickName!: string
  /**
   * @description [text]
   */
  public headImgUrl!: string
  /**
   * @description [timestamp] 创建时间
   */
  public createdAt!: string
  /**
   * @description [timestamp] 更新时间
   */
  public updatedAt!: string

  protected static _staticDBOptions: DBProtocolV2
  protected static _staticDBObserver?: DBObserver

  public static setDatabase(database: FCDatabase, dbObserver?: DBObserver) {
    this.addStaticOptions({ database: database }, dbObserver)
  }

  public static setStaticProtocol(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static addStaticOptions(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, this._staticDBOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static _onStaticDBOptionsUpdate(_protocol: DBProtocolV2) {}

  public constructor() {
    super()
    this.setDBProtocolV2(this.constructor['_staticDBOptions'])
    this._reloadOnAdded = true
    this._reloadOnUpdated = true
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.officialOpenid = null
    this.nickName = '昵称'
    this.headImgUrl = ''
  }

  public fc_propertyMapper() {
    return {
      unionId: 'union_id',
      officialOpenid: 'official_openid',
      nickName: 'nick_name',
      headImgUrl: 'head_img_url',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
}
