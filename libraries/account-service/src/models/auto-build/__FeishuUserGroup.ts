import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'group_id',
  'name',
  'description',
  'members_info',
  'is_valid',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'group_id',
  'name',
  'description',
  'members_info',
  'is_valid',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'name',
  'description',
  'members_info',
  'is_valid',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_feishu_user_group',
  primaryKey: 'group_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __FeishuUserGroup extends FeedBase {
  /**
   * @description [varchar(40)] 飞书 group_id
   */
  public groupId!: string
  /**
   * @description [varchar(127)] 用户组名
   */
  public name!: string
  /**
   * @description [text] 用户组描述
   */
  public description!: string
  /**
   * @description [mediumtext] 成员信息，空 | JSON 字符串
   */
  public membersInfo!: string
  /**
   * @description [tinyint] 是否活跃
   */
  public isValid!: number
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
    this.name = ''
    this.description = ''
    this.membersInfo = ''
    this.isValid = 0
  }

  public fc_propertyMapper() {
    return {
      groupId: 'group_id',
      name: 'name',
      description: 'description',
      membersInfo: 'members_info',
      isValid: 'is_valid',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
