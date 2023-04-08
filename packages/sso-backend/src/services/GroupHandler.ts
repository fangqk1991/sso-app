import { _Group } from '../models/permission/_Group'
import { P_GroupParams } from '@fangcha/account-models'
import { Transaction } from 'sequelize'
import { makeUUID } from '@fangcha/tools'
import { MyPermissionServer } from './MyPermissionServer'
import assert from '@fangcha/assert'
import { GroupCategory, GroupCategoryDescriptor } from '@web/sso-common/user-models'
import { MyFeishuServer } from './MyFeishuServer'

export class GroupHandler {
  public readonly group: _Group

  public constructor(group: _Group) {
    this.group = group
  }

  public static checkValidParams(params: P_GroupParams, onlyCheckDefinedKeys = false) {
    if (!onlyCheckDefinedKeys || params.name !== undefined) {
      assert.ok(!!params.name, '组名 不能为空')
    }
    if (!onlyCheckDefinedKeys || params.groupCategory !== undefined) {
      assert.ok(GroupCategoryDescriptor.checkValueValid(params.groupCategory), 'groupCategory 有误')
    }
    if (params.groupCategory === GroupCategory.Department) {
      assert.ok(!!params.departmentId, '部门 不能为空')
    }
  }

  public static async makeGroupFeed(appid: string, params: P_GroupParams, transaction?: Transaction) {
    this.checkValidParams(params)
    const group = new MyPermissionServer.Group()
    group.groupId = makeUUID()
    group.appid = appid
    group.author = params.author || ''
    group.version = 1
    await new this(group).changeWithParams(params, transaction)
    return group
  }

  public async changeWithParams(params: P_GroupParams, transaction?: Transaction) {
    const group = this.group
    if (params.groupAlias && params.groupAlias !== group.groupAlias) {
      const feed = await MyPermissionServer.Group.findOne(
        {
          appid: group.appid,
          group_alias: params.groupAlias,
        },
        transaction
      )
      assert.ok(!feed, `groupAlias: ${params.groupAlias} 已存在，不可导入`)
    }

    if (params.groupAlias !== undefined) {
      group.groupAlias = params.groupAlias || group.groupId
    }

    if (params.name !== undefined) {
      group.name = params.name || ''
    }

    if (params.remarks !== undefined) {
      group.remarks = params.remarks || ''
    }

    if (params.groupCategory !== undefined) {
      group.groupCategory = params.groupCategory as GroupCategory
      switch (params.groupCategory) {
        case GroupCategory.Custom:
          group.departmentId = null
          group.isFullDepartment = 0
          break
        case GroupCategory.Department:
          group.departmentId = params.departmentId || null
          group.isFullDepartment = params.isFullDepartment || 0
          if (params.departmentId) {
            const department = await MyFeishuServer.findDepartment(params.departmentId, transaction)
            if (!department) {
              group.groupCategory = GroupCategory.Custom
              group.departmentId = null
            } else {
              group.departmentHash = department.hash
            }
          }
          break
      }
    }

    if (params.isRetained !== undefined) {
      group.isRetained = params.isRetained || 0
    }
    if (params.blackPermission !== undefined) {
      group.blackPermission = params.blackPermission || 0
    }
    if (params.isEnabled !== undefined) {
      group.isEnabled = params.isEnabled || 0
    }
    if (params.subGroupIdList !== undefined) {
      group.subGroupsStr = [...new Set(params.subGroupIdList)].join(',')
    }
  }
}
