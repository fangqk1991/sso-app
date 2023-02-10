import {
  AppFullInfo,
  AppImportParams,
  FullGroupInfo,
  GroupCalculator,
  GroupImportParams,
  P_AppParams,
  P_GroupParams,
  P_Tmp_VisitorParams,
  PermissionsGrantParams,
} from '@web/auth-common/models'
import { DiffEntity, makeRandomStr, makeUUID } from '@fangcha/tools'
import { Transaction } from 'fc-sql'
import assert from '@fangcha/assert'
import { _App } from '../models/permission/_App'
import { _Group } from '../models/permission/_Group'
import { _GroupMember } from '../models/permission/_GroupMember'
import { _GroupAccess } from '../models/permission/_GroupAccess'

export class AppHandler {
  public readonly app: _App

  public constructor(app: _App) {
    this.app = app
  }

  public async updateFullApp(params: AppImportParams) {
    const app = this.app
    const App = app.getClass()
    const powerUserList = params.powerUserList || []
    if (params.author && !powerUserList.includes(params.author)) {
      powerUserList.push(params.author)
    }
    params.powerUserList = powerUserList
    App.checkValidParams(params, true)
    assert.ok(Array.isArray(params.groupList), 'groupList must be an array')

    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      app.fc_edit()
      if (params.name !== undefined) {
        app.name = params.name
      }
      if (params.remarks !== undefined) {
        app.remarks = params.remarks
      }
      if (params.configData !== undefined) {
        app.configInfo = JSON.stringify(params.configData)
      }
      if (params.permissionMeta !== undefined) {
        app.permissionInfo = JSON.stringify(params.permissionMeta)
      }
      app.powerUsers = (params.powerUserList || []).join(',')
      ++app.version
      await app.updateToDB(transaction)
      for (const groupParams of params.groupList) {
        groupParams.author = app.author
        await this.generateFullGroup(groupParams, transaction)
      }
    })
    return app
  }

  public async importOpenVisitors(visitors: P_Tmp_VisitorParams[], author: string) {
    const app = this.app
    const Group = app.getClass().Group
    assert.ok(Array.isArray(visitors), 'visitors must be an array')

    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const params of visitors) {
        const group = new Group()
        group.groupId = makeUUID()
        group.appid = app.appid
        group.groupAlias = params.visitorId || group.groupId
        group.name = params.name || ''
        group.remarks = ''
        group.author = author
        group.version = 1
        await group.addToDB(transaction)

        const access = new Group.GroupAccess()
        access.accessId = makeUUID()
        access.groupId = group.groupId
        access.groupSecret = params.secret || makeRandomStr(32)
        access.author = author
        await access.addToDB(transaction)
      }
      await app.increaseVersion(transaction)
    })
    return app
  }

  public async updateApp(params: P_AppParams, author: string) {
    const app = this.app
    const App = app.getClass()
    App.checkValidParams(params, true)
    app.fc_edit()
    if (params.name !== undefined) {
      app.name = params.name || ''
    }
    if (params.remarks !== undefined) {
      app.remarks = params.remarks || ''
    }
    if (params.configData) {
      app.configInfo = JSON.stringify(params.configData)
    }
    if (params.permissionMeta) {
      app.permissionInfo = JSON.stringify(params.permissionMeta)
    }
    if (params.powerUserList) {
      const powerUserList = params.powerUserList
      if (!powerUserList.includes(author)) {
        powerUserList.push(author)
      }
      app.powerUsers = powerUserList.join(',')
    }
    ++app.version
    await app.updateToDB()
  }

  public async getFullAppInfo(): Promise<AppFullInfo> {
    const app = this.app
    const Group = app.getClass().Group
    const fullInfo = app.modelForClient() as AppFullInfo
    {
      const groupFeeds = await app.getEnabledGroupList()
      fullInfo.groups = groupFeeds.map((item) => {
        const data = item.toJSON() as FullGroupInfo
        data.permissionKeys = []
        data.memberEmails = []
        data.groupSecrets = []
        return data
      })
    }
    const groupData: { [p: string]: FullGroupInfo } = fullInfo.groups.reduce((result, cur) => {
      result[cur.groupId] = cur
      return result
    }, {})
    GroupCalculator.fillGroupsFullSubGroupIdList(fullInfo.groups, groupData)
    {
      const searcher = new Group.GroupPermission().fc_searcher()
      searcher.processor().setColumns(['group_id', 'permission_key'])
      searcher.processor().addConditionKeyInArray(
        'group_id',
        fullInfo.groups.map((item) => item.groupId)
      )
      const items = await searcher.queryAllFeeds()
      for (const item of items) {
        groupData[item.groupId].permissionKeys.push(item.permissionKey)
      }
    }
    {
      const searcher = new Group.GroupAccess().fc_searcher()
      searcher.processor().setColumns(['group_id', 'group_secret'])
      searcher.processor().addConditionKeyInArray(
        'group_id',
        fullInfo.groups.map((item) => item.groupId)
      )
      const items = await searcher.queryAllFeeds()
      for (const item of items) {
        groupData[item.groupId].groupSecrets.push(item.groupSecret)
      }
    }
    {
      const searcher = new Group.GroupMember().fc_searcher()
      searcher.processor().setColumns(['group_id', 'member'])
      searcher.processor().addConditionKeyInArray(
        'group_id',
        fullInfo.groups.map((item) => item.groupId)
      )
      const items = await searcher.queryAllFeeds()
      for (const item of items) {
        groupData[item.groupId].memberEmails.push(item.member)
      }
    }
    fullInfo.groups.forEach((group) => {
      group.fullMemberEmails = [
        ...new Set(
          group.fullSubGroupIdList.reduce((result, groupId) => {
            return result.concat(groupData[groupId].memberEmails)
          }, [] as string[])
        ),
      ]
    })
    fullInfo.groups.forEach((group) => {
      group.memberEmails = group.fullMemberEmails
      group.fullMemberEmails = []
    })
    return fullInfo
  }

  public async generateGroup(params: P_GroupParams, transaction?: Transaction) {
    const app = this.app
    const Group = app.getClass().Group
    const group = await Group.makeGroupFeed(app.appid, params, transaction)
    const handler = async (transaction: Transaction) => {
      await group.addToDB(transaction)
      await app.increaseVersion(transaction)
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = app.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
    return group
  }

  public async generateFullGroup(params: GroupImportParams, transaction?: Transaction) {
    const app = this.app
    const Group = app.getClass().Group
    if (params.groupAlias === params.groupId && /^\w{32}$/.test(params.groupId)) {
      params.groupAlias = ''
    }
    assert.ok(Array.isArray(params.permissionKeys), 'permissionKeys must be an array')
    assert.ok(Array.isArray(params.members), 'members must be an array')
    for (const memberParams of params.members) {
      assert.ok(!!memberParams.member, 'members.*.member can not be empty')
    }
    const group = await Group.makeGroupFeed(app.appid, params, transaction)
    const handler = async (transaction: Transaction) => {
      await group.addToDB(transaction)
      for (const permissionKey of params.permissionKeys) {
        const permission = new Group.GroupPermission()
        permission.groupId = group.groupId
        permission.permissionKey = permissionKey
        permission.author = group.author
        await permission.strongAddToDB(transaction)
      }
      for (const memberParams of params.members) {
        const member = new Group.GroupMember()
        member.groupId = group.groupId
        member.member = memberParams.member
        member.isAdmin = memberParams.isAdmin ? 1 : 0
        member.author = group.author
        await member.weakAddToDB(transaction)
      }
      await app.increaseVersion(transaction)
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = app.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }

    return group
  }

  public async destroyAllGroups() {
    const app = this.app
    const groups = await app.getGroupList()
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const group of groups) {
        await group.deleteFromDB(transaction)
      }
      await app.increaseVersion(transaction)
    })
  }

  public async updateGroup(group: _Group, params: P_GroupParams, transaction?: Transaction) {
    const app = this.app
    const Group = app.getClass().Group
    Group.checkValidParams(params, true)

    const handler = async (transaction: Transaction) => {
      group.fc_edit()
      await group.changeWithParams(group.appid, params, transaction)
      ++group.version
      await group.updateToDB(transaction)
      await app.increaseVersion(transaction)
    }

    if (transaction) {
      await handler(transaction)
    } else {
      const runner = app.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
  }

  public async updateFullGroup(group: _Group, params: GroupImportParams) {
    const app = this.app
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await this.updateGroup(group, params, transaction)
      await group.removePermissionsAndMembers(transaction)
      await group.updatePermissionsAndMembers(params, transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async deleteGroup(group: _Group) {
    const app = this.app
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await group.deleteFromDB(transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async updateGroupPermissions(group: _Group, diffItems: DiffEntity[], author: string) {
    const app = this.app
    const Group = app.getClass().Group
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const item of diffItems) {
        const permission = new Group.GroupPermission()
        permission.groupId = group.groupId
        permission.permissionKey = item.keychain[0]
        permission.author = author
        if (item.type === 'Deleted') {
          await permission.deleteFromDB(transaction)
        } else if (item.type === 'Created') {
          await permission.strongAddToDB(transaction)
        }
      }
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async addGroupMultipleMembers(group: _Group, memberList: string[], author: string) {
    memberList = memberList.map((item) => item.trim()).filter((item) => !!item)
    assert.ok(memberList.length > 0, '请选择要添加的成员')
    const app = this.app
    const Group = app.getClass().Group
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const memberStr of memberList) {
        const member = new Group.GroupMember()
        member.groupId = group.groupId
        member.member = memberStr
        member.author = author
        await member.weakAddToDB(transaction)
      }
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async removeGroupMember(group: _Group, memberStr: string) {
    const member = await group.findMember(memberStr)
    assert.ok(!!member, '成员不存在')
    const app = this.app
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await member.deleteFromDB(transaction)
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async updateGroupMember(group: _Group, member: _GroupMember, isAdmin: number) {
    const app = this.app
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await member.updateLevel(isAdmin, transaction)
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async generateGroupSecret(group: _Group, author: string) {
    const app = this.app
    const Group = app.getClass().Group
    let access!: _GroupAccess
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      access = await Group.GroupAccess.generateGroupAccess(group.groupId, author, transaction)
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
    return access
  }

  public async removeGroupAccess(group: _Group, access: _GroupAccess) {
    const app = this.app
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await access.deleteFromDB(transaction)
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
  }

  public async grantStaffPermissions(email: string, params: PermissionsGrantParams, operator = '') {
    const app = this.app
    const Group = app.getClass().Group
    const runner = app.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      let group = await app.findGroup(email, transaction)
      if (!group) {
        group = await Group.makeGroupFeed(
          app.appid,
          {
            name: email,
            remarks: '',
            author: operator,
          } as P_GroupParams,
          transaction
        )
        await group.addToDB(transaction)
      }
      for (const permissionKey of params.permissionKeys) {
        const permission = new Group.GroupPermission()
        permission.groupId = group.groupId
        permission.permissionKey = permissionKey
        permission.author = operator
        await permission.strongAddToDB(transaction)
      }
      await group.increaseVersion(transaction)
      await app.increaseVersion(transaction)
    })
  }
}
