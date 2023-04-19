import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/session'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { MyClientManager } from '../../../services/MyClientManager'
import { SsoClientSpecHandler } from './SsoClientSpecHandler'
import { SsoClientParams } from '@fangcha/sso-models'
import { UserAdminUtils } from '../UserAdminUtils'

const factory = new SpecFactory('SSO Client')

factory.prepare(Admin_SsoClientApis.ClientPageDataGet, async (ctx) => {
  // const session = ctx.session as FangchaSession
  // session.assertVisitorHasPermission(SsoAdminPermissionKey.OAuthApps)
  ctx.body = await MyClientManager.SsoClient.getPageResult(ctx.request.query)
})

factory.prepare(Admin_SsoClientApis.MyClientPageDataGet, async (ctx) => {
  const session = ctx.session as FangchaSession
  ctx.body = await MyClientManager.SsoClient.getPageResult({
    ...ctx.request.query,
    lockedUser: session.curUserStr(),
  })
})

factory.prepare(Admin_SsoClientApis.ClientInfoGet, async (ctx) => {
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    ctx.body = client.getModelForAdmin()
  })
})

factory.prepare(Admin_SsoClientApis.ClientCreate, async (ctx) => {
  const session = ctx.session as FangchaSession
  const client = await MyClientManager.generateClient(ctx.request.body, session.curUserStr())
  const data = client.getModelForAdmin()
  data.clientSecret = client.clientSecret
  ctx.body = data
})

factory.prepare(Admin_SsoClientApis.ClientInfoUpdate, async (ctx) => {
  const session = ctx.session as FangchaSession
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    const options = ctx.request.body as SsoClientParams
    await client.updateInfos(
      {
        name: options.name,
        redirectUriList: options.redirectUriList,
        powerUsers: options.powerUsers,
      },
      session.curUserStr()
    )
    ctx.body = client.getModelForAdmin()
  })
})

factory.prepare(Admin_SsoClientApis.ClientInfoPowerUpdate, async (ctx) => {
  await UserAdminUtils.checkUserSystemAdmin(ctx)
  const session = ctx.session as FangchaSession
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    const options = ctx.request.body as SsoClientParams
    await client.updateInfos(options, session.curUserStr())
    ctx.body = client.getModelForAdmin()
  })
})

factory.prepare(Admin_SsoClientApis.ClientDelete, async (ctx) => {
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    await client.deleteFromDB()
    ctx.status = 200
  })
})

factory.prepare(Admin_SsoClientApis.ClientAuthPageDataGet, async (ctx) => {
  await new SsoClientSpecHandler(ctx).handle(async (client) => {
    ctx.body = await MyClientManager.UserAuth.getPageResult({
      ...ctx.request.query,
      isEnabled: 1,
      clientId: client.clientId,
    })
  })
})

export const SsoClientSpecs = factory.buildSpecs()
