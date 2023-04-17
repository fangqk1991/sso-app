import { __Group } from '../auto-build/__Group'
import { FilterOptions } from 'fc-feed'
import {
  FullGroupInfo,
  GroupCalculator,
  GroupCategory,
  GroupExportInfo,
  P_GroupDetail,
  P_GroupInfo,
  P_MemberParams,
} from '@fangcha/account-models'
import { _GroupAccess } from './_GroupAccess'
import { _GroupMember } from './_GroupMember'
import { _GroupPermission } from './_GroupPermission'
import { Transaction } from 'sequelize'

export class _Group extends __Group {
  groupCategory!: GroupCategory

  public static GroupAccess: { new (): _GroupAccess } & typeof _GroupAccess
  public static GroupMember: { new (): _GroupMember } & typeof _GroupMember
  public static GroupPermission: { new (): _GroupPermission } & typeof _GroupPermission

  public constructor() {
    super()
  }

  public getClass() {
    return this.constructor as typeof _Group
  }

  public static async getPageResult(filterParams?: FilterOptions) {
    const pageResult = await super.getPageResult(filterParams)
    const groups = pageResult.items as P_GroupDetail[]
    const groupData = groups.reduce((result, cur) => {
      cur.permissionKeys = []
      result[cur.groupId] = cur
      return result
    }, {}) as { [p: string]: P_GroupDetail }
    {
      const searcher = new this.GroupPermission().fc_searcher()
      searcher.processor().addConditionKeyInArray(
        'group_id',
        groups.map((item) => item.groupId)
      )
      const items = await searcher.queryAllFeeds()
      for (const item of items) {
        groupData[item.groupId].permissionKeys.push(item.permissionKey)
      }
    }
    return pageResult
  }

  public async removePermissionsAndMembers(transaction?: Transaction) {
    const GroupPermission = this.getClass().GroupPermission
    const GroupMember = this.getClass().GroupMember
    const handler = async (transaction: Transaction) => {
      {
        const searcher = new GroupPermission().fc_searcher()
        searcher.processor().transaction = transaction
        searcher.processor().addConditionKV('group_id', this.groupId)
        const items = await searcher.queryAllFeeds()
        for (const item of items) {
          await item.deleteFromDB(transaction)
        }
      }
      {
        const searcher = new GroupMember().fc_searcher()
        searcher.processor().transaction = transaction
        searcher.processor().addConditionKV('group_id', this.groupId)
        const items = await searcher.queryAllFeeds()
        for (const item of items) {
          await item.deleteFromDB(transaction)
        }
      }
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = this.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
  }

  public async updatePermissionsAndMembers(
    params: {
      permissionKeys: string[]
      members: P_MemberParams[]
    },
    transaction?: Transaction
  ) {
    const GroupMember = this.getClass().GroupMember
    const GroupPermission = this.getClass().GroupPermission
    const group = this
    const handler = async (transaction: Transaction) => {
      if (Array.isArray(params.permissionKeys)) {
        for (const permissionKey of params.permissionKeys) {
          const permission = new GroupPermission()
          permission.groupId = group.groupId
          permission.permissionKey = permissionKey
          permission.author = group.author
          await permission.strongAddToDB(transaction)
        }
      }
      if (Array.isArray(params.members)) {
        for (const memberParams of params.members) {
          const member = new GroupMember()
          member.groupId = group.groupId
          member.userId = memberParams.userId
          member.remarks = memberParams.remarks || ''
          member.author = group.author
          await member.weakAddToDB(transaction)
        }
      }
      await group.increaseVersion(transaction)
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = group.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
  }

  public async getPermissionKeys() {
    const GroupPermission = this.getClass().GroupPermission
    const searcher = new GroupPermission().fc_searcher()
    searcher.processor().addConditionKV('group_id', this.groupId)
    const items = await searcher.queryAllFeeds()
    return items.map((item) => item.permissionKey)
  }

  public toJSON(): P_GroupInfo {
    const data = this.fc_pureModel() as P_GroupInfo
    data.subGroupIdList = this.subGroupIdList()
    return data
  }

  public async getDetailInfo(): Promise<P_GroupDetail> {
    const Group = this.getClass()
    const GroupMember = this.getClass().GroupMember
    const data = this.toJSON() as P_GroupDetail
    data.permissionKeys = await this.getPermissionKeys()
    data.fullMemberIdList = []
    data.fullSubGroupIdList = []
    if (data.subGroupIdList.length > 0) {
      const searcher = new Group().fc_searcher()
      searcher.processor().addConditionKV('appid', this.appid)
      searcher.processor().addConditionKV('is_enabled', 1)
      searcher.processor().addConditionKV('black_permission', 0)
      const items = await searcher.queryAllFeeds()
      const groupData: { [p: string]: FullGroupInfo } = items.reduce((result, cur) => {
        result[cur.groupId] = cur.toJSON()
        return result
      }, {})
      GroupCalculator.fillGroupsFullSubGroupIdList([data], groupData)

      data.subGroupMapper = data.subGroupIdList.reduce((result, groupId) => {
        result[groupId] = groupData[groupId]
        return result
      }, {})
      {
        const searcher = new GroupMember().fc_searcher()
        searcher.processor().addConditionKeyInArray('group_id', data.fullSubGroupIdList)
        const items = await searcher.queryAllFeeds()
        data.fullMemberIdList = [...new Set(items.map((item) => item.userId))]
      }
    }
    return data
  }

  public async getGroupExportInfo(): Promise<GroupExportInfo> {
    const data = this.toJSON() as GroupExportInfo
    data.permissionKeys = await this.getPermissionKeys()
    const memberList = await this.getMemberList()
    data.members = memberList.map((item) => item.modelForClient())
    return data
  }

  public async getMemberList() {
    const GroupMember = this.getClass().GroupMember
    const searcher = new GroupMember().fc_searcher()
    searcher.processor().addConditionKV('group_id', this.groupId)
    return searcher.queryAllFeeds()
  }

  public async findMember(member: string) {
    const GroupMember = this.getClass().GroupMember
    return (await GroupMember.findOne({
      group_id: this.groupId,
      user_id: member,
    }))!
  }

  public async increaseVersion(transaction: Transaction) {
    this.fc_edit()
    ++this.version
    await this.updateToDB(transaction)
  }

  public fc_searcher(params: FilterOptions = {}) {
    const searcher = super.fc_searcher(params)
    const keywords = params.keywords || ''
    if (keywords) {
      searcher
        .processor()
        .addSpecialCondition(
          'group_id LIKE BINARY ? OR group_alias LIKE BINARY ? OR name LIKE ?',
          `%${keywords}%`,
          `%${keywords}%`,
          `%${keywords}%`
        )
    }
    const tableName_group = this.getClass()._staticDBOptions.table
    const tableName_groupPermission = this.getClass().GroupPermission['_staticDBOptions'].table
    const tableName_groupMember = this.getClass().GroupMember['_staticDBOptions'].table
    const includingPermission = params.includingPermission
    if (includingPermission) {
      searcher
        .processor()
        .addSpecialCondition(
          `EXISTS (SELECT ${tableName_group}.group_id FROM ${tableName_groupPermission} WHERE ${tableName_group}.group_id = ${tableName_groupPermission}.group_id AND ${tableName_groupPermission}.permission_key = ?)`,
          includingPermission
        )
    }
    const includingMember = params.includingMember
    if (includingMember) {
      searcher
        .processor()
        .addSpecialCondition(
          `${tableName_group}.group_alias = ? OR EXISTS (SELECT ${tableName_group}.group_id FROM ${tableName_groupMember} WHERE ${tableName_group}.group_id = ${tableName_groupMember}.group_id AND ${tableName_groupMember}.user_id IN ("*", ?))`,
          includingMember,
          includingMember,
          includingMember
        )
    }
    return searcher
  }

  public subGroupIdList() {
    const items: string[] = (this.subGroupsStr || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
    return [...new Set(items)]
  }
}
