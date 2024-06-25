import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'openid',
  'union_id',
  'created_at',
  'updated_at',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'openid',
  'union_id',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'union_id',
  'created_at',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'created_at',
  'updated_at',
]

const dbOptions = {
  table: 'fc_weixin_openid',
  primaryKey: 'openid',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __WeixinOpenid extends FeedBase {
  /**
   * @description [varchar(64)] Open ID
   */
  public openid!: string
  /**
   * @description [varchar(64)] 微信 union_id
   */
  public unionId!: string
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
  }

  public fc_propertyMapper() {
    return {
      openid: 'openid',
      unionId: 'union_id',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
}
