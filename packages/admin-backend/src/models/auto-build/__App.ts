import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'appid',
  'app_type',
  'name',
  'remarks',
  'config_info',
  'permission_info',
  'power_users',
  'version',
  'author',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'appid',
  'app_type',
  'name',
  'remarks',
  'config_info',
  'permission_info',
  'power_users',
  'version',
  'author',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'app_type',
  'name',
  'remarks',
  'config_info',
  'permission_info',
  'power_users',
  'version',
  'author',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_app',
  primaryKey: 'appid',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __App extends FeedBase {
  /**
   * @description [varchar(32)] 应用 appid
   */
  public appid!: string
  /**
   * @description [enum('Admin','Open')] 应用类型
   */
  public appType!: string
  /**
   * @description [varchar(127)] 应用名
   */
  public name!: string
  /**
   * @description [varchar(255)] 备注
   */
  public remarks!: string
  /**
   * @description [mediumtext] 配置信息，空 | JSON 字符串
   */
  public configInfo!: string
  /**
   * @description [mediumtext] 权限定义，空 | JSON 字符串
   */
  public permissionInfo!: string
  /**
   * @description [text] 具备操作权的用户，以 , 分隔
   */
  public powerUsers!: string
  /**
   * @description [bigint] 版本号
   */
  public version!: number
  /**
   * @description [varchar(127)] 创建者
   */
  public author!: string
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
    this.appType = 'Admin'
    this.name = ''
    this.remarks = ''
    this.configInfo = ''
    this.permissionInfo = ''
    this.powerUsers = ''
    this.version = 0
    this.author = ''
  }

  public fc_propertyMapper() {
    return {
      appid: 'appid',
      appType: 'app_type',
      name: 'name',
      remarks: 'remarks',
      configInfo: 'config_info',
      permissionInfo: 'permission_info',
      powerUsers: 'power_users',
      version: 'version',
      author: 'author',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
