import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'account_uid',
  'password',
  'is_enabled',
  'nick_name',
  'register_ip',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'account_uid',
  'password',
  'is_enabled',
  'nick_name',
  'register_ip',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'password',
  'is_enabled',
  'nick_name',
  'register_ip',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_account',
  primaryKey: 'account_uid',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __Account extends FeedBase {
  /**
   * @description [char(32)] 账号 UUID，具备唯一性
   */
  public accountUid!: string
  /**
   * @description [varchar(64)] bcrypt.hash(password, salt)
   */
  public password!: string
  /**
   * @description [tinyint] 是否可用
   */
  public isEnabled!: number
  /**
   * @description [varchar(64)] 昵称
   */
  public nickName!: string
  /**
   * @description [varchar(64)] 注册 IP 地址
   */
  public registerIp!: string
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
    this.password = ''
    this.isEnabled = 1
    this.nickName = ''
    this.registerIp = ''
  }

  public fc_propertyMapper() {
    return {
      accountUid: 'account_uid',
      password: 'password',
      isEnabled: 'is_enabled',
      nickName: 'nick_name',
      registerIp: 'register_ip',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
