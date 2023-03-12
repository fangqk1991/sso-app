import { Context } from 'koa'
import assert from '@fangcha/assert'
import { FangchaSession } from '@fangcha/session'
import AppError from '@fangcha/app-error'
import { _App } from '../models/permission/_App'
import { MyPermissionServer } from './MyPermissionServer'
import { _AppAccess } from '../models/permission/_AppAccess'
import { _Group } from '../models/permission/_Group'
import { _GroupAccess } from '../models/permission/_GroupAccess'

export interface AppSpecHandlerProtocol {
  checkVisitorAppAdmin: (ctx: Context, app: _App) => Promise<boolean>
  assertAppAccessible: (ctx: Context, app: _App, isSelfHelp?: boolean) => Promise<void>
  routeTransform?: (route: string) => string
  getVisitorEmail?: (ctx: Context) => string
}

export class CommonAppSpecHandler {
  public readonly ctx: Context
  public readonly protocol: AppSpecHandlerProtocol
  public readonly isSelfHelp: boolean

  public constructor(ctx: Context, protocol: AppSpecHandlerProtocol, isSelfHelp?: boolean) {
    this.ctx = ctx
    this.protocol = protocol
    this.isSelfHelp = isSelfHelp || false
  }

  private curVisitorEmail() {
    const ctx = this.ctx
    if (this.protocol.getVisitorEmail) {
      const email = this.protocol.getVisitorEmail(ctx)
      assert.ok(!!email, 'x-user-visitor 未传递', 400)
      return email
    }
    const session = ctx.session as FangchaSession
    return session.curUserStr()
  }

  private _app!: _App
  public async prepareApp() {
    if (!this._app) {
      const ctx = this.ctx
      const app = (await MyPermissionServer.findApp(ctx.params.appid))!
      assert.ok(!!app, `P_App(${ctx.params.appid}) Not Found`)
      await this.protocol.assertAppAccessible(ctx, app, this.isSelfHelp)
      this._app = app
    }
    return this._app
  }

  private _appAccess!: _AppAccess
  public async prepareAppAccess() {
    if (!this._appAccess) {
      const ctx = this.ctx
      const feed = (await MyPermissionServer.AppAccess.findWithUid(ctx.params.accessId))!
      assert.ok(!!feed, 'P_AppAccess Not Found')
      const app = await this.prepareApp()
      assert.ok(feed.appid === app.appid, `access's appid invalid`)
      this._appAccess = feed
    }
    return this._appAccess
  }

  private _group!: _Group
  public async prepareGroup() {
    if (!this._group) {
      const ctx = this.ctx
      let group = (await MyPermissionServer.Group.findWithUid(ctx.params.groupId))!
      const app = await this.prepareApp()
      if (!group) {
        group = (await MyPermissionServer.Group.findOne({
          appid: app.appid,
          group_alias: ctx.params.groupId,
        }))!
      }
      assert.ok(!!group, 'P_Group Not Found')
      assert.ok(group.appid === app.appid, `group's appid invalid`)
      this._group = group
    }
    return this._group
  }

  private _groupAccess!: _GroupAccess
  public async prepareGroupAccess() {
    if (!this._groupAccess) {
      const ctx = this.ctx
      const feed = (await MyPermissionServer.GroupAccess.findWithUid(ctx.params.accessId))!
      assert.ok(!!feed, `P_AppAccess(${ctx.params.accessId}) Not Found`)
      const group = await this.prepareGroup()
      assert.ok(feed.groupId === group.groupId, `access's groupId invalid`)
      this._groupAccess = feed
    }
    return this._groupAccess
  }

  public async assertVisitorGroupMemberAdmin() {
    const email = this.curVisitorEmail()
    const app = await this.prepareApp()
    if (await this.protocol.checkVisitorAppAdmin(this.ctx, app)) {
      return
    }
    const group = await this.prepareGroup()
    const member = await group.findMember(email)
    if (member && member.isAdmin) {
      return
    }
    throw new AppError(`${email} 不是 ${group.name}[${group.groupId}] 的管理员`)
  }
}
