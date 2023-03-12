import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/session'
import { Admin_AppApis } from '@web/sso-common/admin-api'
import { MyPermissionServer } from '../../../services/MyPermissionServer'
import { Admin_AppSpecsBuilder, UserAdminUtils } from '../UserAdminUtils'
import { AppHandler } from '../../../services/AppHandler'

const factory = new SpecFactory('应用')

factory.prepare(Admin_AppApis.AppPageDataGet, async (ctx) => {
  const session = ctx.session as FangchaSession
  const params = ctx.request.query
  if (
    !(await UserAdminUtils.checkUserSystemAdmin(ctx))
  ) {
    params['lockedUser'] = session.curUserStr()
  }
  ctx.body = await MyPermissionServer.App.getPageResult(params)
})

factory.prepare(Admin_AppApis.AppCreate, async (ctx) => {
  const session = ctx.session as FangchaSession
  const app = await MyPermissionServer.generateApp({
    ...ctx.request.body,
    author: session.curUserStr(),
  })
  ctx.body = app.modelForClient()
})

factory.prepare(Admin_AppApis.AppFullCreate, async (ctx) => {
  const session = ctx.session as FangchaSession
  const app = await MyPermissionServer.generateFullApp({
    ...ctx.request.body,
    author: session.curUserStr(),
  })
  ctx.body = app.modelForClient()
})

factory.prepare(Admin_AppApis.AppDelete, async (ctx) => {
  const app = await Admin_AppSpecsBuilder.makeHandler(ctx).prepareApp()
  await app.deleteFromDB()
  ctx.status = 200
})

factory.prepare(Admin_AppApis.AppOpenVisitorsImport, async (ctx) => {
  const app = await Admin_AppSpecsBuilder.makeHandler(ctx).prepareApp()
  const session = ctx.session as FangchaSession
  await new AppHandler(app).importOpenVisitors(ctx.request.body, session.curUserStr())
  ctx.status = 200
})

export const AppSpecs = factory.buildSpecs()
