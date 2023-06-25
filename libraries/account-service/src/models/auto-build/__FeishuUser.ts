import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'union_id',
  'user_id',
  'open_id',
  'email',
  'name',
  'is_valid',
  'extras_info',
  'raw_data_str',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'union_id',
  'user_id',
  'open_id',
  'email',
  'name',
  'is_valid',
  'extras_info',
  'raw_data_str',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'user_id',
  'open_id',
  'email',
  'name',
  'is_valid',
  'extras_info',
  'raw_data_str',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_feishu_user',
  primaryKey: 'union_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __FeishuUser extends FeedBase {
  /**
   * @description [varchar(40)] 飞书 union_id
   */
  public unionId!: string
  /**
   * @description [varchar(40)] 飞书 user_id
   */
  public userId!: string
  /**
   * @description [varchar(40)] 飞书 open_id
   */
  public openId!: string
  /**
   * @description [varchar(127)] 用户邮箱
   */
  public email!: string
  /**
   * @description [varchar(127)] 姓名
   */
  public name!: string
  /**
   * @description [tinyint] 是否活跃
   */
  public isValid!: number
  /**
   * @description [mediumtext] 附加信息，空 | JSON 字符串
   */
  public extrasInfo!: string
  /**
   * @description [mediumtext] 原始信息
   */
  public rawDataStr!: string
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
    this.isValid = 0
    this.extrasInfo = ''
    this.rawDataStr = ''
  }

  public fc_propertyMapper() {
    return {
      unionId: 'union_id',
      userId: 'user_id',
      openId: 'open_id',
      email: 'email',
      name: 'name',
      isValid: 'is_valid',
      extrasInfo: 'extras_info',
      rawDataStr: 'raw_data_str',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
