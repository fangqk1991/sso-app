import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'group_id',
  'appid',
  'group_alias',
  'group_category',
  'department_id',
  'is_full_department',
  'department_hash',
  'name',
  'remarks',
  'version',
  'author',
  'is_retained',
  'is_enabled',
  'black_permission',
  'sub_groups_str',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'group_id',
  'appid',
  'group_alias',
  'group_category',
  'department_id',
  'is_full_department',
  'department_hash',
  'name',
  'remarks',
  'version',
  'author',
  'is_retained',
  'is_enabled',
  'black_permission',
  'sub_groups_str',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'appid',
  'group_alias',
  'group_category',
  'department_id',
  'is_full_department',
  'department_hash',
  'name',
  'remarks',
  'version',
  'author',
  'is_retained',
  'is_enabled',
  'black_permission',
  'sub_groups_str',
  'create_time',
]
const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'fc_group',
  primaryKey: 'group_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __Group extends FeedBase {
  /**
   * @description [char(32)] 组 ID，具备唯一性
   */
  public groupId!: string
  /**
   * @description [varchar(32)] appid，SQL 外键 -> fc_app.appid
   */
  public appid!: string
  /**
   * @description [varchar(64)] 组的别名，由用户自行指定，具备唯一性
   */
  public groupAlias!: string
  /**
   * @description [enum('Custom','Department','Staff')] 组类别
   */
  public groupCategory!: string
  /**
   * @description [varchar(40)] 绑定部门 ID
   */
  public departmentId!: string | null
  /**
   * @description [tinyint] 是否包含子孙部门
   */
  public isFullDepartment!: number
  /**
   * @description [char(8)] 部门摘要值
   */
  public departmentHash!: string
  /**
   * @description [varchar(127)] 组名
   */
  public name!: string
  /**
   * @description [varchar(255)] 备注
   */
  public remarks!: string
  /**
   * @description [bigint] 版本号
   */
  public version!: number
  /**
   * @description [varchar(127)] 创建者
   */
  public author!: string
  /**
   * @description [tinyint] 是否为系统预留组（不可删除）
   */
  public isRetained!: number
  /**
   * @description [tinyint] 是否有效
   */
  public isEnabled!: number
  /**
   * @description [tinyint] 所选的权限项列表为黑名单
   */
  public blackPermission!: number
  /**
   * @description [mediumtext] 子组 ID 列表，使用 , 分割
   */
  public subGroupsStr!: string
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
    this.groupCategory = 'Custom'
    this.departmentId = null
    this.isFullDepartment = 0
    this.departmentHash = ''
    this.name = ''
    this.remarks = ''
    this.version = 0
    this.author = ''
    this.isRetained = 0
    this.isEnabled = 1
    this.blackPermission = 0
    this.subGroupsStr = ''
  }

  public fc_propertyMapper() {
    return {
      groupId: 'group_id',
      appid: 'appid',
      groupAlias: 'group_alias',
      groupCategory: 'group_category',
      departmentId: 'department_id',
      isFullDepartment: 'is_full_department',
      departmentHash: 'department_hash',
      name: 'name',
      remarks: 'remarks',
      version: 'version',
      author: 'author',
      isRetained: 'is_retained',
      isEnabled: 'is_enabled',
      blackPermission: 'black_permission',
      subGroupsStr: 'sub_groups_str',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
