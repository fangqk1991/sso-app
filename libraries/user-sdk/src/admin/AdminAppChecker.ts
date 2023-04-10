import { UserAppChecker } from '../core/UserAppChecker'
import assert from '@fangcha/assert'
import { AppFullInfo, FullGroupInfo } from '@fangcha/account-models'

interface GroupMemberMapper {
  [groupId: string]: {
    [email: string]: true
  }
}

export class AdminAppChecker extends UserAppChecker {
  protected _groupMemberMapper: GroupMemberMapper = {}

  public constructor() {
    super()
  }

  public setAppInfo(appInfo: AppFullInfo) {
    super.setAppInfo(appInfo)
    const groupMemberMapper: GroupMemberMapper = {}
    for (const group of appInfo.groups) {
      if (!groupMemberMapper[group.groupId]) {
        groupMemberMapper[group.groupId] = {}
      }
      for (const memberId of group.memberIdList) {
        groupMemberMapper[group.groupId][memberId] = true
        groupMemberMapper[group.groupId][memberId.toLocaleLowerCase()] = true
      }
    }
    this._groupMemberMapper = groupMemberMapper
  }

  public assertGroupExists(...groupIdList: string[]) {
    const appGroups = this.appGroups()
    for (const groupId of groupIdList) {
      assert.ok(
        !!appGroups.find((item) => item.groupId === groupId || item.groupAlias === groupId),
        `${groupId} 不存在`,
        500
      )
    }
  }

  public prepareRetainGroup(groupId: string) {
    const group = this.appGroups().find((item) => item.groupId === groupId || item.groupAlias === groupId)
    assert.ok(!!group, `保留组 ${groupId} 未被创建，请联系管理员`, 500)
    return group!
  }

  public getGroupsForUser(email: string) {
    return this.appGroups().filter(
      (item) =>
        this._groupMemberMapper[item.groupId] &&
        (this._groupMemberMapper[item.groupId]['*'] ||
          this._groupMemberMapper[item.groupId][email] ||
          this._groupMemberMapper[item.groupId][email.toLocaleLowerCase()])
    )
  }

  public checkGroupHasPermission(groupId: string, permissionKey: string) {
    return this._groupPermissionMapper[groupId][permissionKey]
  }

  public getUsersForPermission(permissionKey: string) {
    return [...this.getUsersSetForPermission(permissionKey)]
  }

  public getUsersSetForPermission(permissionKey: string) {
    const groups = this.appGroups().filter((item) => this._groupPermissionMapper[item.groupId][permissionKey])
    const userKeySet = new Set<string>()
    groups.forEach((group) => {
      group.memberIdList.forEach((key) => {
        userKeySet.add(key)
      })
    })
    groups
      .filter((item) => item.blackPermission)
      .forEach((group) => {
        group.memberIdList.forEach((key) => {
          userKeySet.delete(key)
        })
      })
    return userKeySet
  }

  public getPermissionKeysForUser(email: string) {
    return Object.keys(this.getPermissionKeyMapForUser(email))
  }

  public getPermissionKeyMapForUser(email: string) {
    const groups = this.getGroupsForUser(email)
    const permissionKeyMap: { [p: string]: 1 } = {}
    groups.forEach((group) => {
      Object.keys(this._groupPermissionMapper[group.groupId]).forEach((key) => {
        permissionKeyMap[key] = 1
      })
    })
    groups
      .filter((group) => group.blackPermission)
      .forEach((group) => {
        Object.keys(this._groupPermissionMapper[group.groupId]).forEach((key) => {
          delete permissionKeyMap[key]
        })
      })
    return permissionKeyMap
  }

  public checkUserInAnyGroup(email: string, ...groupIds: string[]) {
    const groups = this.getGroupsForUser(email)
    const groupMap = groups.reduce<{ [p: string]: FullGroupInfo }>((result, cur) => {
      if (cur.groupAlias) {
        result[cur.groupAlias] = cur
      }
      result[cur.groupId] = cur
      return result
    }, {})
    for (const groupId of groupIds) {
      if (groupId in groupMap) {
        return true
      }
    }
    return false
  }

  public checkUserIsAdmin(email: string) {
    return this.appPowerUsers().includes(email)
  }

  public assertUserIsAdmin(email: string) {
    assert.ok(this.checkUserIsAdmin(email), `${email} 必须为应用的管理员`, 403)
  }

  public checkUserHasPermission(email: string, permissionKey: string) {
    const groups = this.getGroupsForUser(email)
    const blackGroups = groups.filter((item) => item.blackPermission)
    const whiteGroups = groups.filter((item) => !item.blackPermission)
    for (const group of blackGroups) {
      if (this._groupPermissionMapper[group.groupId][permissionKey]) {
        return false
      }
    }
    for (const group of whiteGroups) {
      if (this._groupPermissionMapper[group.groupId][permissionKey]) {
        return true
      }
    }
    return false
  }

  public getPermissionMeta(permissionKey: string) {
    assert.ok(!!this._permissionData[permissionKey], `${permissionKey} 未定义`, 500)
    return this._permissionData[permissionKey]
  }

  public assertUserHasPermission(email: string, permissionKey: string) {
    const permissionName = this._permissionData[permissionKey]
      ? this._permissionData[permissionKey].name
      : permissionKey
    assert.ok(
      this.checkUserHasPermission(email, permissionKey),
      `${email} 不具备权限 "${permissionName} [${permissionKey}]"`,
      403
    )
  }
}
