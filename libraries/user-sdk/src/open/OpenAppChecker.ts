import assert from '@fangcha/assert'
import { UserAppChecker } from '../core/UserAppChecker'
import { AppFullInfo, FullGroupInfo } from '@fangcha/account-models'
import { OpenVisitor } from '@fangcha/router'

export class OpenAppChecker extends UserAppChecker {
  protected _visitorMap: { [p: string]: OpenVisitor & { group: FullGroupInfo } } = {}

  public constructor() {
    super()
  }

  public setAppInfo(appInfo: AppFullInfo) {
    super.setAppInfo(appInfo)
    this._visitorMap = this.appInfo().groups.reduce((result, group) => {
      const visitorId = group.groupAlias || group.groupId
      result[visitorId] = {
        visitorId: visitorId,
        name: group.name,
        secrets: group.groupSecrets,
        permissionKeys: group.permissionKeys,
        isEnabled: true,
        group: group,
      }
      return result
    }, {})
  }

  public assertSessionValid(visitorId: string, secret: string) {
    const visitor = this._visitorMap[visitorId]
    assert.ok(!!visitor, `Visitor(${visitorId}) not exists.`, 401)
    // assert.ok(app.isEnabled, `Visitor(${visitor.name} ${visitor.visitorId}) is no longer available`, 401)
    assert.ok(visitor.secrets.includes(secret), `Visitor[${visitorId}]' secret error.`, 401)
  }

  public prepareVisitorInfo(visitorId: string, secret: string) {
    this.assertSessionValid(visitorId, secret)
    return this._visitorMap[visitorId]
  }

  public checkVisitorHasPermission(visitorId: string, permissionKey: string) {
    const visitor = this._visitorMap[visitorId]
    const group = visitor.group
    if (group.blackPermission) {
      return false
    }
    return this._groupPermissionMapper[group.groupId][permissionKey] || false
  }

  public assertVisitorHasPermission(visitorId: string, permissionKey: string) {
    const permissionName = this._permissionData[permissionKey]
      ? this._permissionData[permissionKey].name
      : permissionKey
    assert.ok(
      this.checkVisitorHasPermission(visitorId, permissionKey),
      `${visitorId} 不具备权限 "${permissionName} [${permissionKey}]"`,
      403
    )
  }
}
