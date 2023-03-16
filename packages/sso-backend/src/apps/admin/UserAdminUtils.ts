import { FangchaSession } from '@fangcha/session'
import AppError from '@fangcha/app-error'
import assert from '@fangcha/assert'
import { Context } from 'koa'
import { AppSpecsBuilder } from '../../services/AppSpecsBuilder'
import { _App } from '../../models/permission/_App'
import { UserSystemCenter } from '../../services/UserSystemCenter'

export const Admin_AppSpecsBuilder = new AppSpecsBuilder({
  // routeTransform: (route) => {
  //   return route.replace(/^\/api\//, '/api/user-sdk/')
  // },
  checkVisitorAppAdmin: async (ctx, app) => {
    return await UserAdminUtils.checkVisitorAppAdmin(ctx, app)
  },
  assertAppAccessible: async (ctx, app, isSelfHelp) => {
    if (isSelfHelp) {
      return
    }
    if (ctx.method === 'GET') {
      return
    }
    if (await UserAdminUtils.checkVisitorAppAdmin(ctx, app)) {
      return
    }
    throw new AppError(`您不是 ${app.appid} 的管理员，无权操作`, 403)
  },
})

export class UserAdminUtils {
  public static async checkUserSystemAdmin(ctx: Context) {
    const session = ctx.session as FangchaSession
    const app = await UserSystemCenter.prepareUserSystemApp()
    const userList = app.powerUserList()
    return userList.includes(session.curUserStr()) || userList.includes('*')
  }

  public static async assertUserSystemAdmin(ctx: Context) {
    assert.ok(await this.checkUserSystemAdmin(ctx), `您不是 User 系统的管理员，无权操作`, 403)
  }

  public static async checkVisitorAppAdmin(ctx: Context, app: _App) {
    const session = ctx.session as FangchaSession
    const userList = app.powerUserList()
    if (userList.includes(session.curUserStr()) || userList.includes('*')) {
      return true
    }
    if (await UserAdminUtils.checkUserSystemAdmin(ctx)) {
      return true
    }
    return false
  }
}
