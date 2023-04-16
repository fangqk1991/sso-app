import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'group_id',
  'user_id',
  'is_admin',
  'author',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'group_id',
  'user_id',
  'is_admin',
  'author',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'group_id',
  'user_id',
  'is_admin',
  'author',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_group_member',
  primaryKey: ['group_id', 'user_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __GroupMember extends FeedBase {
  /**
   * @description [char(32)] 组 ID，SQL 外键 -> fc_group.group_id
   */
  public groupId!: string
  /**
   * @description [varchar(127)] 用户唯一标识；(group_id, user_id) 具备唯一性
   */
  public userId!: string
  /**
   * @description [tinyint] 是否为管理员
   */
  public isAdmin!: number
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
    this.isAdmin = 0
    this.author = ''
  }

  public fc_propertyMapper() {
    return {
      groupId: 'group_id',
      userId: 'user_id',
      isAdmin: 'is_admin',
      author: 'author',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
