import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'is_stash',
  'open_department_id',
  'department_id',
  'parent_open_department_id',
  'department_name',
  'path',
  'hash',
  'extras_info',
  'raw_data_str',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'is_stash',
  'open_department_id',
  'department_id',
  'parent_open_department_id',
  'department_name',
  'path',
  'hash',
  'extras_info',
  'raw_data_str',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'is_stash',
  'open_department_id',
  'department_id',
  'parent_open_department_id',
  'department_name',
  'path',
  'hash',
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
  table: 'fc_feishu_department',
  primaryKey: ['is_stash', 'open_department_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export class __FeishuDepartment extends FeedBase {
  /**
   * @description [tinyint] 是否为数据副本
   */
  public isStash!: number
  /**
   * @description [varchar(40)] 飞书 open_department_id
   */
  public openDepartmentId!: string
  /**
   * @description [varchar(40)] 飞书 department_id
   */
  public departmentId!: string
  /**
   * @description [varchar(40)] 父级 open_department_id
   */
  public parentOpenDepartmentId!: string
  /**
   * @description [text] 部门名称
   */
  public departmentName!: string
  /**
   * @description [text] 完整路径
   */
  public path!: string
  /**
   * @description [char(8)] MD5 摘要值
   */
  public hash!: string
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
    this.isStash = 0
    this.departmentName = ''
    this.path = ''
    this.hash = ''
    this.extrasInfo = ''
    this.rawDataStr = ''
  }

  public fc_propertyMapper() {
    return {
      isStash: 'is_stash',
      openDepartmentId: 'open_department_id',
      departmentId: 'department_id',
      parentOpenDepartmentId: 'parent_open_department_id',
      departmentName: 'department_name',
      path: 'path',
      hash: 'hash',
      extrasInfo: 'extras_info',
      rawDataStr: 'raw_data_str',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
