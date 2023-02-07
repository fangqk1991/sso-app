import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'carrier_uid',
  'carrier_type',
  'extras_info',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'carrier_uid',
  'carrier_type',
  'extras_info',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'carrier_uid',
  'carrier_type',
  'extras_info',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_account_carrier_extras',
  primaryKey: ['carrier_uid', 'carrier_type'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __AccountCarrierExtras extends FeedBase {
  /**
   * @description [varchar(64)] 载体 ID
   */
  public carrierUid!: string
  /**
   * @description [varchar(16)] 账号载体（登录方式）
   */
  public carrierType!: string
  /**
   * @description [mediumtext] 附加信息
   */
  public extrasInfo!: string
  /**
   * @description [timestamp] 创建时间
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间
   */
  public updateTime!: string

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
    this.extrasInfo = ''
  }

  public fc_propertyMapper() {
    return {
      carrierUid: 'carrier_uid',
      carrierType: 'carrier_type',
      extrasInfo: 'extras_info',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
