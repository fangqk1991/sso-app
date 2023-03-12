import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { _SessionApp, FangchaSession } from '@fangcha/session'
import { UserSdkApis } from '@fangcha/account-models'
import { AdminUserCenter } from '../admin/AdminUserCenter'

const factory = new SpecFactory('UserSdkApis')

factory.prepare(UserSdkApis.PermissionCheck, async (ctx) => {
  const permissionKey = ctx.request.query.permissionKey as string
  const session = ctx.session as FangchaSession
  const email = session.curUserStr()
  ctx.body = {
    [`session.checkVisitorHasPermission(${permissionKey})`]: session.checkVisitorHasPermission(permissionKey),
    [`_SessionApp.checkUserHasPermission(${email}, ${permissionKey})`]: _SessionApp.checkUserHasPermission(
      email,
      permissionKey
    ),
    [`AdminUserCenter.checker().checkUserHasPermission(${email}, ${permissionKey})`]:
      AdminUserCenter.checker().checkUserHasPermission(email, permissionKey),
  }
})

factory.prepare(UserSdkApis.AdminCheck, async (ctx) => {
  const session = ctx.session as FangchaSession
  const email = session.curUserStr()
  ctx.body = {
    [`session.checkVisitorIsAdmin()`]: session.checkVisitorIsAdmin(),
    [`_SessionApp.checkUserIsAdmin(${email})`]: _SessionApp.checkUserIsAdmin(email),
    [`AdminUserCenter.checker().checkUserIsAdmin(${email})`]: AdminUserCenter.checker().checkUserIsAdmin(email),
  }
})

export const UserSdkSpecs = factory.buildSpecs()

export const UserSdkSpecDocItem: SwaggerDocItem = {
  name: 'User SDK',
  pageURL: '/api-docs/v1/user-sdk',
  specs: UserSdkSpecs,
}
