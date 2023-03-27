import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'is_stash',
  'open_department_id',
  'union_id',
  'is_leader',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'is_stash',
  'open_department_id',
  'union_id',
  'is_leader',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'is_stash',
  'open_department_id',
  'union_id',
  'is_leader',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_feishu_department_member',
  primaryKey: ['is_stash', 'open_department_id', 'union_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __FeishuDepartmentMember extends FeedBase {
  /**
   * @description [tinyint] 是否为数据副本
   */
  public isStash!: number
  /**
   * @description [varchar(40)] 飞书 open_department_id
   */
  public openDepartmentId!: string
  /**
   * @description [varchar(40)] 飞书 user_id
   */
  public unionId!: string
  /**
   * @description [tinyint] 是否为组长
   */
  public isLeader!: number
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
    this.isStash = 0
    this.isLeader = 0
  }

  public fc_propertyMapper() {
    return {
      isStash: 'is_stash',
      openDepartmentId: 'open_department_id',
      unionId: 'union_id',
      isLeader: 'is_leader',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
