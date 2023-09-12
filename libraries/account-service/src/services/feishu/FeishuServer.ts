import { FCDatabase, Transaction } from 'fc-sql'
import { _FeishuDepartment } from '../../models/feishu/_FeishuDepartment'
import { _FeishuDepartmentMember } from '../../models/feishu/_FeishuDepartmentMember'
import { _FeishuUser } from '../../models/feishu/_FeishuUser'
import { FeishuDepartmentHandler } from './FeishuDepartmentHandler'
import assert from '@fangcha/assert'
import { _FeishuUserGroup } from '../../models/feishu/_FeishuUserGroup'

interface Options {
  database: FCDatabase

  // Default: fc_feishu_department
  tableName_FeishuDepartment?: string

  // Default: fc_feishu_department_member
  tableName_FeishuDepartmentMember?: string

  // Default: fc_feishu_user
  tableName_FeishuUser?: string

  // Default: fc_feishu_user_group
  tableName_FeishuUserGroup?: string
}

export class FeishuServer {
  public readonly options: Options
  public readonly database: FCDatabase
  public readonly FeishuDepartment!: { new (): _FeishuDepartment } & typeof _FeishuDepartment
  public readonly FeishuDepartmentMember!: { new (): _FeishuDepartmentMember } & typeof _FeishuDepartmentMember
  public readonly FeishuUser!: { new (): _FeishuUser } & typeof _FeishuUser
  public readonly FeishuUserGroup!: { new (): _FeishuUserGroup } & typeof _FeishuUserGroup

  public readonly tableName_FeishuDepartment: string
  public readonly tableName_FeishuDepartmentMember: string
  public readonly tableName_FeishuUser: string
  public readonly tableName_FeishuUserGroup: string

  constructor(options: Options) {
    this.options = options

    this.database = options.database

    this.tableName_FeishuDepartment = options.tableName_FeishuDepartment || 'fc_feishu_department'
    this.tableName_FeishuDepartmentMember = options.tableName_FeishuDepartmentMember || 'fc_feishu_department_member'
    this.tableName_FeishuUser = options.tableName_FeishuUser || 'fc_feishu_user'
    this.tableName_FeishuUserGroup = options.tableName_FeishuUserGroup || 'fc_feishu_user_group'

    class FeishuDepartmentMember extends _FeishuDepartmentMember {}
    FeishuDepartmentMember.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuDepartmentMember,
    })
    this.FeishuDepartmentMember = FeishuDepartmentMember

    class FeishuDepartment extends _FeishuDepartment {}
    FeishuDepartment.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuDepartment,
    })
    this.FeishuDepartment = FeishuDepartment

    class FeishuUser extends _FeishuUser {}
    FeishuUser.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuUser,
    })
    this.FeishuUser = FeishuUser

    class FeishuUserGroup extends _FeishuUserGroup {}
    FeishuUserGroup.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuUserGroup,
    })
    this.FeishuUserGroup = FeishuUserGroup
  }

  public async checkFeishuValid() {
    const rootDepartment = await this.FeishuDepartment.getRootDepartment()
    return !!rootDepartment
  }

  public async findDepartment(departmentId: string, transaction?: Transaction) {
    const searcher = new this.FeishuDepartment().fc_searcher()
    if (transaction) {
      searcher.processor().transaction = transaction
    }
    searcher.processor().addConditionKV('open_department_id', departmentId)
    return (await searcher.queryOne())!
  }

  public async getMembersInfo(params: { unionIdList?: string[]; userIdList?: string[] }) {
    assert.ok(
      Array.isArray(params.unionIdList) || Array.isArray(params.userIdList),
      'unionIdList or userIdList must be an array'
    )
    const searcher = new this.FeishuUser().fc_searcher()
    if (Array.isArray(params.unionIdList)) {
      searcher.processor().addConditionKeyInArray('union_id', params.unionIdList || [])
    }
    if (Array.isArray(params.userIdList)) {
      searcher.processor().addConditionKeyInArray('user_id', params.userIdList || [])
    }
    const items = await searcher.queryAllFeeds()
    return items.map((item) => item.modelForClient())
  }

  public async getFullStructureInfo() {
    const rootDepartment = await this.FeishuDepartment.getRootDepartment()
    assert.ok(!!rootDepartment, `Root Department Not Found`, 500)
    const handler = this.departmentHandler(rootDepartment)
    return handler.getStructureInfo(true)
  }

  public departmentHandler(department: _FeishuDepartment) {
    return new FeishuDepartmentHandler(department, this)
  }

  public async getDepartmentMap(departmentIds: string[]) {
    const searcher = new this.FeishuDepartment().fc_searcher()
    searcher.processor().addConditionKeyInArray('open_department_id', departmentIds)
    const items = await searcher.queryAllFeeds()
    const itemData: { [p: string]: _FeishuDepartment } = items.reduce((result, cur) => {
      result[cur.openDepartmentId] = cur
      return result
    }, {})
    return itemData
  }
}
