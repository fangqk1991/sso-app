import { FCDatabase } from 'fc-sql'
import { _FeishuDepartment } from './models/feishu/_FeishuDepartment'
import { _FeishuDepartmentMember } from './models/feishu/_FeishuDepartmentMember'
import { _FeishuUser } from './models/feishu/_FeishuUser'

interface Options {
  database: FCDatabase

  // Default: fc_feishu_department
  tableName_FeishuDepartment?: string

  // Default: fc_feishu_department_member
  tableName_FeishuDepartmentMember?: string

  // Default: fc_feishu_user
  tableName_FeishuUser?: string
}

export class FeishuServer {
  public readonly options: Options
  public readonly database: FCDatabase
  public readonly FeishuDepartment!: { new (): _FeishuDepartment } & typeof _FeishuDepartment
  public readonly FeishuDepartmentMember!: { new (): _FeishuDepartmentMember } & typeof _FeishuDepartmentMember
  public readonly FeishuUser!: { new (): _FeishuUser } & typeof _FeishuUser

  public readonly tableName_FeishuDepartment: string
  public readonly tableName_FeishuDepartmentMember: string
  public readonly tableName_FeishuUser: string

  constructor(options: Options) {
    this.options = options

    this.database = options.database

    this.tableName_FeishuDepartment = options.tableName_FeishuDepartment || 'fc_feishu_department'
    this.tableName_FeishuDepartmentMember = options.tableName_FeishuDepartmentMember || 'fc_feishu_department_member'
    this.tableName_FeishuUser = options.tableName_FeishuUser || 'fc_feishu_user'

    class FeishuDepartment extends _FeishuDepartment {}
    FeishuDepartment.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuDepartment,
    })
    this.FeishuDepartment = FeishuDepartment

    class FeishuDepartmentMember extends _FeishuDepartmentMember {}
    FeishuDepartmentMember.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuDepartmentMember,
    })
    this.FeishuDepartmentMember = FeishuDepartmentMember

    class FeishuUser extends _FeishuUser {}
    FeishuUser.addStaticOptions({
      database: options.database,
      table: this.tableName_FeishuUser,
    })
    this.FeishuUser = FeishuUser
  }

  public async getFullStructureInfo() {
    const rootDepartment = await this.FeishuDepartment.getRootDepartment()
    return rootDepartment.getStructureInfo()
  }
}
