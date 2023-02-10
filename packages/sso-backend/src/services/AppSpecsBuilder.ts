import { SpecFactory } from '@fangcha/router'
import { Context } from 'koa'
import { FangchaSession } from '@fangcha/router/lib/session'
import assert from '@fangcha/assert'
import { AppSpecHandlerProtocol, CommonAppSpecHandler } from './CommonAppSpecHandler'
import { CommonAppApis, CommonSearchApis } from '@web/sso-common/core-api'
import { AppHandler } from './AppHandler'
import { MyPermissionServer } from './MyPermissionServer'
import { MyAccountServer } from './MyAccountServer'
import { SsoAdminConfig } from '../SsoConfig'

export class AppSpecsBuilder {
  public readonly protocol: AppSpecHandlerProtocol

  public constructor(protocol: AppSpecHandlerProtocol) {
    this.protocol = protocol
  }

  public makeHandler(ctx: Context, isSelfHelp = false) {
    return new CommonAppSpecHandler(ctx, this.protocol, isSelfHelp)
  }

  public curVisitorEmail(ctx: Context) {
    if (this.protocol.getVisitorEmail) {
      const email = this.protocol.getVisitorEmail(ctx)
      assert.ok(!!email, 'x-user-visitor 未传递', 400)
      return email
    }
    const session = ctx.session as FangchaSession
    return session.curUserStr()
  }

  public makeAppSpecs() {
    const factory = new SpecFactory('应用', {
      routeTransform: this.protocol.routeTransform,
    })

    factory.prepare(CommonAppApis.AppInfoGet, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const data = app.modelForClient()
      data.swaggerPageUrl = `${SsoAdminConfig.openBaseURL}/api-docs/v1/app`
      ctx.body = data
    })

    factory.prepare(CommonAppApis.AppUpdate, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      await new AppHandler(app).updateApp(ctx.request.body, this.curVisitorEmail(ctx))
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppFullInfoUpdate, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      await new AppHandler(app).updateFullApp({
        ...ctx.request.body,
        author: this.curVisitorEmail(ctx),
      })
      ctx.body = app.modelForClient()
    })

    factory.prepare(CommonAppApis.AppOpenInfoPreview, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      ctx.body = await new AppHandler(app).getFullAppInfo()
    })

    factory.prepare(CommonAppApis.AppInfoExport, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      ctx.set('Content-disposition', `attachment; filename=${app.appid}.json`)
      ctx.body = JSON.stringify(await app.getExportInfo(), null, 2)
    })

    factory.prepare(CommonAppApis.AppAccessPageDataGet, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      ctx.body = await MyPermissionServer.AppAccess.getPageResult({
        appid: app.appid,
      })
    })

    factory.prepare(CommonAppApis.AppAccessCreate, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const access = await MyPermissionServer.AppAccess.generateAppAccess(app.appid, this.curVisitorEmail(ctx))
      ctx.body = access.fullModelInfo()
    })

    factory.prepare(CommonAppApis.AppAccessInfoRequest, async (ctx) => {
      const appAccess = await this.makeHandler(ctx).prepareAppAccess()
      ctx.body = await appAccess.fullModelInfo()
    })

    factory.prepare(CommonAppApis.AppAccessDelete, async (ctx) => {
      const appAccess = await this.makeHandler(ctx).prepareAppAccess()
      await appAccess.deleteFromDB()
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGreenFullInfoRequest, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const fullAppInfo = await new AppHandler(app).getFullAppInfo()
      fullAppInfo.groups.forEach((item) => {
        delete (item as any).groupSecrets
      })
      ctx.body = fullAppInfo
    })

    factory.prepare(CommonAppApis.UserRelativeAppInfoGet, async (ctx) => {
      ctx.body = {}
    })

    factory.prepare(CommonAppApis.AppAllGroupListGet, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const pageResult = await MyPermissionServer.Group.getPageResult({
        appid: app.appid,
        _length: -1,
      })
      ctx.body = pageResult.items
    })

    factory.prepare(CommonAppApis.AppGroupPageDataGet, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      ctx.body = await MyPermissionServer.Group.getPageResult({
        ...ctx.request.query,
        appid: app.appid,
      })
    })

    factory.prepare(CommonAppApis.AppDepartmentGroupListGet, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const searcher = new MyPermissionServer.Group().fc_searcher()
      searcher.processor().addConditionKV('appid', app.appid)
      const items = await searcher.queryAllFeeds()
      ctx.body = items.map((item) => item.toJSON())
    })

    factory.prepare(CommonAppApis.AppGroupCreate, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const group = await new AppHandler(app).generateGroup({
        ...ctx.request.body,
        author: this.curVisitorEmail(ctx),
      })
      ctx.body = await group.getDetailInfo()
    })

    factory.prepare(CommonAppApis.AppGroupFullCreate, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      const group = await new AppHandler(app).generateFullGroup({
        ...ctx.request.body,
        author: this.curVisitorEmail(ctx),
      })
      ctx.body = await group.getDetailInfo()
    })

    factory.prepare(CommonAppApis.AppGroupsDestroy, async (ctx) => {
      const app = await this.makeHandler(ctx).prepareApp()
      await new AppHandler(app).destroyAllGroups()
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGroupInfoGet, async (ctx) => {
      const group = await this.makeHandler(ctx).prepareGroup()
      ctx.body = await group.getDetailInfo()
    })

    factory.prepare(CommonAppApis.AppGroupFullMembersGet, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()

      const fullAppInfo = await new AppHandler(app).getFullAppInfo()
      const keyGroup = fullAppInfo.groups.find((item) => item.groupId === group.groupId)!
      ctx.body = keyGroup.memberEmails
    })

    factory.prepare(CommonAppApis.AppGroupInfoExport, async (ctx) => {
      const group = await this.makeHandler(ctx).prepareGroup()
      ctx.set('Content-disposition', `attachment; filename=${group.appid}_${group.groupAlias || group.groupId}.json`)
      ctx.body = JSON.stringify(await group.getGroupExportInfo(), null, 2)
    })

    factory.prepare(CommonAppApis.AppGroupInfoUpdate, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      await new AppHandler(app).updateGroup(group, ctx.request.body)
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppFullGroupInfoUpdate, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      await new AppHandler(app).updateFullGroup(group, ctx.request.body)
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGroupDelete, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      assert.ok(!group.isRetained, `该组为保留组，不可删除`)
      await new AppHandler(app).deleteGroup(group)
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGroupPermissionUpdate, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      await new AppHandler(app).updateGroupPermissions(group, ctx.request.body, this.curVisitorEmail(ctx))
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGroupAccessPageDataGet, async (ctx) => {
      const group = await this.makeHandler(ctx).prepareGroup()
      ctx.body = await MyPermissionServer.GroupAccess.getPageResult({
        appid: group.appid,
        groupId: group.groupId,
      })
    })

    factory.prepare(CommonAppApis.AppGroupAccessCreate, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      const access = await new AppHandler(app).generateGroupSecret(group, this.curVisitorEmail(ctx))
      ctx.body = access.fullModelInfo()
    })

    factory.prepare(CommonAppApis.AppGroupAccessInfoRequest, async (ctx) => {
      const access = await this.makeHandler(ctx).prepareGroupAccess()
      ctx.body = await access.fullModelInfo()
    })

    factory.prepare(CommonAppApis.AppGroupAccessDelete, async (ctx) => {
      const handler = this.makeHandler(ctx)
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      const access = await handler.prepareGroupAccess()
      await new AppHandler(app).removeGroupAccess(group, access)
      ctx.status = 200
    })

    return factory.buildSpecs()
  }

  public makeGroupMemberSpecs() {
    const factory = new SpecFactory('应用组成员', {
      routeTransform: this.protocol.routeTransform,
    })

    factory.prepare(CommonAppApis.AppGroupMemberListGet, async (ctx) => {
      const group = await this.makeHandler(ctx, true).prepareGroup()
      const items = await group.getMemberList()
      ctx.body = items.map((item) => item.fc_pureModel())
    })

    factory.prepare(CommonAppApis.AppGroupMemberCreate, async (ctx) => {
      const handler = this.makeHandler(ctx, true)
      await handler.assertVisitorGroupMemberAdmin()
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      const { memberList } = ctx.request.body
      await new AppHandler(app).addGroupMultipleMembers(group, memberList, this.curVisitorEmail(ctx))
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGroupMemberUpdate, async (ctx) => {
      const handler = this.makeHandler(ctx, true)
      await handler.assertVisitorGroupMemberAdmin()
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      const member = await group.findMember(ctx.params.member)
      assert.ok(!!member, '成员不存在')
      const { isAdmin } = ctx.request.body
      assert.ok([0, 1].includes(isAdmin), 'isAdmin 需要为 0 或 1')
      await new AppHandler(app).updateGroupMember(group, member, isAdmin)
      ctx.status = 200
    })

    factory.prepare(CommonAppApis.AppGroupMemberDelete, async (ctx) => {
      const handler = this.makeHandler(ctx, true)
      await handler.assertVisitorGroupMemberAdmin()
      const app = await handler.prepareApp()
      const group = await handler.prepareGroup()
      await new AppHandler(app).removeGroupMember(group, ctx.params.member)
      ctx.status = 200
    })

    return factory.buildSpecs()
  }

  public makeSearchSpecs() {
    const factory = new SpecFactory('搜索', {
      routeTransform: this.protocol.routeTransform,
    })

    factory.prepare(CommonSearchApis.StaffSearch, async (ctx) => {
      const FullAccount = MyAccountServer.FullAccount
      const searcher = new FullAccount().fc_searcher(ctx.request.query)
      searcher.processor().setLimitInfo(0, 5)
      const feeds = await searcher.queryAllFeeds()
      ctx.body = feeds.map((item) => item.toJSON())
    })

    return factory.buildSpecs()
  }

  public makeSpecs() {
    return [
      ...this.makeAppSpecs(),
      ...this.makeGroupMemberSpecs(),
      ...this.makeSearchSpecs(),
    ]
  }
}
