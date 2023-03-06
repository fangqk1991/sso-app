import assert from '@fangcha/assert'
import { logger } from '@fangcha/logger'
import { ApiVisitorV2 } from '@fangcha/tools'
import { MyPermissionServer } from './MyPermissionServer'

class _UserVisitorCenter {
  private _visitorMap: { [p: string]: ApiVisitorV2 }

  public constructor() {
    this._visitorMap = {}
  }

  public async reloadVisitorsData() {
    logger.info(`[UserVisitorCenter] Reload Visitors Data`)
    const feeds = await MyPermissionServer.App.prepareVisitorsForOpen()
    this._visitorMap = feeds.reduce((result, feed) => {
      result[feed.appid] = feed
      return result
    }, {})
  }

  public assertSessionValid(appid: string, appSecret: string) {
    const appMap = this._visitorMap
    const app = appMap[appid]
    assert.ok(!!app, `App(${appid}) not exists.`, 401)
    assert.ok(app.isEnabled, `App(${app.name} ${app.appid}) is no longer available`, 401)
    assert.ok(app.secrets.includes(appSecret), 'appSecret error.', 401)
  }

  public getVisitorInfo(appid: string, appSecret: string) {
    this.assertSessionValid(appid, appSecret)
    return this._visitorMap[appid]
  }
}

export const UserVisitorCenter = new _UserVisitorCenter()
