import { SpecFactory } from '@fangcha/router'
import { Context } from 'koa'
import assert from '@fangcha/assert'
import { OpenAppApis } from '@web/sso-common/power-api'
import { FangchaSession } from '@fangcha/session'
import { MyPermissionServer } from '../../../services/MyPermissionServer'
import { AppHandler } from '../../../services/AppHandler'

const prepareApp = async (ctx: Context) => {
  const session = ctx.session as FangchaSession
  const app = (await MyPermissionServer.findApp(session.curUserStr()))!
  assert.ok(!!app, 'P_App Not Found', 500)
  return app
}

const factory = new SpecFactory('应用 / 组')

factory.prepare(OpenAppApis.AppFullInfo, async (ctx) => {
  const app = await prepareApp(ctx)
  ctx.body = await new AppHandler(app).getFullAppInfo()
})

factory.prepare(OpenAppApis.AppVersionGet, async (ctx) => {
  const session = ctx.session as FangchaSession
  const searcher = new MyPermissionServer.App().fc_searcher()
  searcher.processor().setColumns(['version'])
  searcher.processor().addConditionKV('appid', session.curUserStr())
  const app = (await searcher.queryOne())!
  assert.ok(!!app, 'P_App Not Found', 500)
  ctx.body = app.version
})

export const OpenAppSpecs = factory.buildSpecs()
