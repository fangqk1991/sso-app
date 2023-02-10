import { FCDatabase } from 'fc-sql'
import { _App } from '../models/permission/_App'
import { _AppAccess } from '../models/permission/_AppAccess'
import { _Group } from '../models/permission/_Group'
import { _GroupAccess } from '../models/permission/_GroupAccess'
import { _GroupMember } from '../models/permission/_GroupMember'
import { _GroupPermission } from '../models/permission/_GroupPermission'
import { Transaction } from 'sequelize'
import { AppImportParams, AppType, P_AppParams } from '@fangcha/account-models'
import assert from '@fangcha/assert'
import { AppHandler } from '../services/AppHandler'

interface Options {
  database: FCDatabase

  // Default: fc_app
  tableName_App?: string

  // Default: fc_app_access
  tableName_AppAccess?: string

  // Default: fc_group
  tableName_Group?: string

  // Default: fc_group_access
  tableName_GroupAccess?: string

  // Default: fc_group_member
  tableName_GroupMember?: string

  // Default: fc_group_permission
  tableName_GroupPermission?: string
}

export class PermissionServer {
  public readonly options: Options
  public readonly database: FCDatabase
  public readonly App!: { new (): _App } & typeof _App
  public readonly AppAccess!: { new (): _AppAccess } & typeof _AppAccess
  public readonly Group!: { new (): _Group } & typeof _Group
  public readonly GroupAccess!: { new (): _GroupAccess } & typeof _GroupAccess
  public readonly GroupMember!: { new (): _GroupMember } & typeof _GroupMember
  public readonly GroupPermission!: { new (): _GroupPermission } & typeof _GroupPermission

  private readonly tableName_App: string
  private readonly tableName_AppAccess: string
  private readonly tableName_Group: string
  private readonly tableName_GroupAccess: string
  private readonly tableName_GroupMember: string
  private readonly tableName_GroupPermission: string

  constructor(options: Options) {
    this.options = options

    this.database = options.database

    this.tableName_App = options.tableName_App || 'fc_app'
    this.tableName_AppAccess = options.tableName_AppAccess || 'fc_app_access'
    this.tableName_Group = options.tableName_Group || 'fc_group'
    this.tableName_GroupAccess = options.tableName_GroupAccess || 'fc_group_access'
    this.tableName_GroupMember = options.tableName_GroupMember || 'fc_group_member'
    this.tableName_GroupPermission = options.tableName_GroupPermission || 'fc_group_permission'

    class GroupAccess extends _GroupAccess {}
    GroupAccess.addStaticOptions({
      database: options.database,
      table: this.tableName_GroupAccess,
    })
    this.GroupAccess = GroupAccess

    class GroupMember extends _GroupMember {}
    GroupMember.addStaticOptions({
      database: options.database,
      table: this.tableName_GroupMember,
    })
    this.GroupMember = GroupMember

    class GroupPermission extends _GroupPermission {}
    GroupPermission.addStaticOptions({
      database: options.database,
      table: this.tableName_GroupPermission,
    })
    this.GroupPermission = GroupPermission

    class Group extends _Group {}
    Group.addStaticOptions({
      database: options.database,
      table: this.tableName_Group,
    })
    Group.GroupAccess = GroupAccess
    Group.GroupMember = GroupMember
    Group.GroupPermission = GroupPermission
    this.Group = Group

    class AppAccess extends _AppAccess {}
    AppAccess.addStaticOptions({
      database: options.database,
      table: this.tableName_AppAccess,
    })
    this.AppAccess = AppAccess

    class App extends _App {}
    App.addStaticOptions({
      database: options.database,
      table: this.tableName_App,
    })
    App.AppAccess = AppAccess
    App.Group = Group
    this.App = App
  }

  public async findApp(appid: string, transaction?: Transaction) {
    return (await this.App.findWithUid(appid, transaction))!
  }

  public async generateApp(params: P_AppParams) {
    assert.ok(!!params.appid, '应用 ID 不能为空')
    const powerUserList = params.powerUserList || []
    if (params.author && !powerUserList.includes(params.author)) {
      powerUserList.push(params.author)
    }
    params.powerUserList = powerUserList
    this.App.checkValidParams(params)

    const app = new this.App()
    app.appid = params.appid
    app.appType = params.appType || AppType.Admin
    app.name = params.name || ''
    app.remarks = params.remarks || ''
    app.permissionInfo = JSON.stringify(params.permissionMeta)
    app.configInfo = JSON.stringify(params.configData)
    app.powerUsers = (params.powerUserList || []).join(',')
    app.author = params.author || ''
    app.version = 1
    assert.ok(!(await app.checkExistsInDB()), `该应用 ID [${app.appid}] 已被占用，请在更改后提交`)
    await app.addToDB()
    return app
  }

  public async generateFullApp(params: AppImportParams) {
    assert.ok(!!params.appid, '应用 ID 不能为空')
    const powerUserList = params.powerUserList || []
    if (params.author && !powerUserList.includes(params.author)) {
      powerUserList.push(params.author)
    }
    params.powerUserList = powerUserList
    this.App.checkValidParams(params)
    assert.ok(Array.isArray(params.groupList), 'groupList must be an array')

    const app = new this.App()
    app.appid = params.appid
    app.appType = params.appType || AppType.Admin
    app.name = params.name || ''
    app.remarks = params.remarks || ''
    app.permissionInfo = JSON.stringify(params.permissionMeta)
    app.configInfo = JSON.stringify(params.configData || {})
    app.powerUsers = (params.powerUserList || []).join(',')
    app.author = params.author || ''
    app.version = 1
    assert.ok(!(await app.checkExistsInDB()), `该应用 ID [${app.appid}] 已被占用，请在更改后提交`)
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await app.addToDB(transaction)
      const handler = new AppHandler(app)
      for (const groupParams of params.groupList) {
        groupParams.author = app.author
        await handler.generateFullGroup(groupParams, transaction)
      }
    })
    return app
  }
}
