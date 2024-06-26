import { FeishuClient } from '../core/FeishuClient'
import { Raw_FeishuDepartmentTree } from '../core/RawFeishuModels'
import { SQLBulkAdder, SQLModifier } from 'fc-sql'
import { FeishuDepartmentMemberModel, FeishuDepartmentModel, FeishuUserGroupModel } from '@fangcha/account-models'
import { DiffMapper, DiffType } from '@fangcha/tools'
import { BotCore } from '@fangcha/bot-kit'
import { FeishuEmployeeStatus } from '../core/FeishuEmployeeStatus'
import { FeishuServer } from './FeishuServer'
import { _FeishuUser } from '../models/feishu/_FeishuUser'

interface Options {
  feishuServer: FeishuServer
  feishuClient: FeishuClient
  botCore?: BotCore
}

export class FeishuSync {
  private readonly feishuServer: FeishuServer
  private readonly feishuClient: FeishuClient
  private readonly botCore?: BotCore

  public constructor(options: Options) {
    this.feishuServer = options.feishuServer
    this.feishuClient = options.feishuClient
    this.botCore = options.botCore
  }

  public async fetchFullUserGroups() {
    const feishuServer = this.feishuServer
    const feishuClient = this.feishuClient

    const rawGroups = await feishuClient.getAllUserGroups()
    const groups: FeishuUserGroupModel[] = rawGroups.map((item) => ({
      groupId: item.id,
      name: item.name,
      description: item.description,
      isValid: 1,
      memberData: {
        unionIdList: [],
        departmentIdList: [],
      },
    }))

    for (const group of groups) {
      group.memberData = await feishuClient.getGroupAllMembersData(group.groupId)

      const feishuUserGroup = new feishuServer.FeishuUserGroup()
      feishuUserGroup.groupId = group.groupId
      feishuUserGroup.name = group.name
      feishuUserGroup.description = group.description
      feishuUserGroup.isValid = group.isValid
      feishuUserGroup.membersInfo = JSON.stringify(group.memberData)
      await feishuUserGroup.strongAddToDB()
    }

    const dbSpec = new feishuServer.FeishuUserGroup().dbSpec()
    const modifier = new SQLModifier(dbSpec.database)
    modifier.setTable(dbSpec.table)
    modifier.updateKV('is_valid', 0)
    modifier.addConditionKeyNotInArray(
      'group_id',
      groups.map((item) => item.groupId)
    )
    await modifier.execute()
  }

  public async fetchRemoteEmployees() {
    const feishuServer = this.feishuServer
    const feishuClient = this.feishuClient

    const allEmployees = await feishuClient.getAllEmployees({
      // view: 'full',
    })

    const dbSpec = new feishuServer.FeishuUser().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(['union_id', 'is_valid'])
    for (const member of allEmployees) {
      const feishuUser = new feishuServer.FeishuUser()
      feishuUser.unionId = member.user_id
      feishuUser.isValid = [FeishuEmployeeStatus.Working, FeishuEmployeeStatus.WillQuit].includes(
        member.system_fields.status
      )
        ? 1
        : 0
      bulkAdder.putObject(feishuUser.fc_encode())
    }
    await bulkAdder.execute()

    await feishuClient.getUserInfoList(
      allEmployees.map((item) => item.user_id),
      async (records) => {
        const dbSpec = new feishuServer.FeishuUser().dbSpec()
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols().filter((item) => !['extras_info', 'is_valid'].includes(item)))
        for (const member of records) {
          const feishuUser = new feishuServer.FeishuUser()
          feishuUser.openId = member.open_id
          feishuUser.userId = member.user_id
          feishuUser.unionId = member.union_id
          feishuUser.email = member.email || ''
          feishuUser.name = member.name || ''
          feishuUser.city = member.city || ''
          feishuUser.employeeId = member.employee_no || ''
          feishuUser.rawDataStr = JSON.stringify(member)
          bulkAdder.putObject(feishuUser.fc_encode())
        }
        await bulkAdder.execute()
      }
    )
  }

  public async fetchRemoteDepartmentsAndUsers() {
    const feishuServer = this.feishuServer
    const feishuClient = this.feishuClient

    await this.fetchRemoteEmployees()
    await this.fetchFullUserGroups()

    const rootNode = await feishuClient.getDepartmentTree('0')
    rootNode.department.name = rootNode.department.name || 'ROOT'

    const departmentNodeList: Raw_FeishuDepartmentTree[] = []
    let todoItems = [rootNode]
    while (todoItems.length > 0) {
      for (const item of todoItems) {
        departmentNodeList.push(item)
      }
      const nextItems: Raw_FeishuDepartmentTree[] = []
      for (const item of todoItems) {
        nextItems.push(...item.children)
      }
      todoItems = nextItems
    }

    const database = feishuServer.database
    const runner = database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await database.update(
        `DELETE FROM ${feishuServer.tableName_FeishuDepartment} WHERE is_stash = 1`,
        [],
        transaction
      )
      await database.update(
        `DELETE FROM ${feishuServer.tableName_FeishuDepartmentMember} WHERE is_stash = 1`,
        [],
        transaction
      )

      {
        const dbSpec = new feishuServer.FeishuDepartment().dbSpec()
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols())
        departmentNodeList.forEach((item) => {
          const department = item.department
          const feishuDepartment = new feishuServer.FeishuDepartment()
          feishuDepartment.isStash = 1
          feishuDepartment.openDepartmentId = department.open_department_id
          feishuDepartment.departmentId = department.department_id
          feishuDepartment.parentOpenDepartmentId = department.parent_department_id || ''
          feishuDepartment.departmentName = department.name
          feishuDepartment.path = item.path
          feishuDepartment.hash = ''
          feishuDepartment.rawDataStr = JSON.stringify(department)
          bulkAdder.putObject(feishuDepartment.fc_encode())
        })
        await bulkAdder.execute()
      }

      {
        const dbSpec = new feishuServer.FeishuDepartmentMember().dbSpec()
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols())
        departmentNodeList.forEach((item) => {
          item.memberList.forEach((member) => {
            const departmentMember = new feishuServer.FeishuDepartmentMember()
            departmentMember.isStash = 1
            departmentMember.openDepartmentId = item.department.open_department_id
            departmentMember.unionId = member.union_id
            departmentMember.isLeader = 0
            bulkAdder.putObject(departmentMember.fc_encode())
          })
        })
        await bulkAdder.execute()
      }

      {
        const dbSpec = new feishuServer.FeishuDepartmentMember().dbSpec()
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols())
        departmentNodeList.forEach((item) => {
          const leaders = item.department.leaders || []
          leaders.forEach((member) => {
            const departmentMember = new feishuServer.FeishuDepartmentMember()
            departmentMember.isStash = 1
            departmentMember.openDepartmentId = item.department.open_department_id
            departmentMember.unionId = member.leaderID
            departmentMember.isLeader = 1
            bulkAdder.putObject(departmentMember.fc_encode())
          })
        })
        await bulkAdder.execute()
      }
    })
  }

  public async getDepartmentChangeLogs() {
    const diffData = {
      curDepartmentsData: {} as { [p: string]: FeishuDepartmentModel },
      stashDepartmentsData: {} as { [p: string]: FeishuDepartmentModel },
      curDepartmentMembersData: {} as {
        [openDepartmentId: string]: {
          [unionId: string]: FeishuDepartmentMemberModel
        }
      },
      stashDepartmentMembersData: {} as {
        [openDepartmentId: string]: {
          [unionId: string]: FeishuDepartmentMemberModel
        }
      },
    }
    {
      const searcher = new this.feishuServer.FeishuDepartment().full_searcher()
      const fullItems = await searcher.queryAllFeeds()
      for (const item of fullItems) {
        if (item.isStash) {
          diffData.stashDepartmentsData[item.openDepartmentId] = item.modelForClient()
        } else {
          diffData.curDepartmentsData[item.openDepartmentId] = item.modelForClient()
        }
        diffData.curDepartmentMembersData[item.openDepartmentId] = {}
        diffData.stashDepartmentMembersData[item.openDepartmentId] = {}
      }
    }
    {
      const searcher = new this.feishuServer.FeishuDepartmentMember().full_searcher()
      const fullItems = await searcher.queryAllFeeds()
      for (const item of fullItems) {
        if (item.isStash) {
          diffData.stashDepartmentMembersData[item.openDepartmentId][item.unionId] = item.modelForClient()
        } else {
          diffData.curDepartmentMembersData[item.openDepartmentId][item.unionId] = item.modelForClient()
        }
      }
    }

    const messageList: string[] = []
    {
      const diffMapper = new DiffMapper(diffData.curDepartmentsData, diffData.stashDepartmentsData)
      diffMapper.addSpecialKeychain([/^.*$/])
      const diffItems = diffMapper.buildDiffItems()
      diffItems.forEach((item) => {
        if (item.type === DiffType.Created) {
          const department = item.to as FeishuDepartmentModel
          messageList.push(`++ 部门【${department.departmentName}】被创建`)
        } else if (item.type === DiffType.Deleted) {
          const department = item.from as FeishuDepartmentModel
          messageList.push(`-- 部门【${department.departmentName}】被删除`)
        } else if (item.type === DiffType.Updated) {
          const department = item.from as FeishuDepartmentModel
          messageList.push(`** 部门【${department.departmentName}】发生变更`)
        }
      })
    }
    {
      const userList = await new this.feishuServer.FeishuUser().fc_searcher().queryAllFeeds()
      const userData = userList.reduce((result, cur) => {
        result[cur.unionId] = cur
        return result
      }, {}) as { [p: string]: _FeishuUser }
      const diffMapper = new DiffMapper(diffData.curDepartmentMembersData, diffData.stashDepartmentMembersData)
      diffMapper.addSpecialKeychain([/^.*$/, /^.*$/])
      const diffItems = diffMapper.buildDiffItems()
      diffItems
        .filter((item) => item.type === DiffType.Deleted)
        .forEach((item) => {
          const member = item.from as FeishuDepartmentMemberModel
          const department = diffData.curDepartmentsData[member.openDepartmentId]
          messageList.push(`-- ${userData[member.unionId].name} 离开了部门【${department.departmentName}】`)
        })
      diffItems
        .filter((item) => item.type === DiffType.Created)
        .forEach((item) => {
          const member = item.to as FeishuDepartmentMemberModel
          messageList.push(
            `++ ${userData[member.unionId].name} 加入了部门【${
              diffData.stashDepartmentsData[member.openDepartmentId].departmentName
            }】`
          )
        })
      diffItems
        .filter((item) => item.type === DiffType.Updated)
        .forEach((item) => {
          const fromMember = item.from as FeishuDepartmentMemberModel
          const toMember = item.to as FeishuDepartmentMemberModel
          messageList.push(
            `** ${userData[fromMember.unionId].name} isLeader: ${fromMember.isLeader} -> ${toMember.isLeader}`
          )
        })
    }
    return messageList
  }

  public async rebaseDepartmentsAndUsersFromStash() {
    const changeLogs = await this.getDepartmentChangeLogs()

    const database = this.feishuServer.database
    const runner = database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await database.update(
        `DELETE FROM ${this.feishuServer.tableName_FeishuDepartmentMember} WHERE is_stash = 0`,
        [],
        transaction
      )
      await database.update(
        `DELETE FROM ${this.feishuServer.tableName_FeishuDepartment} WHERE is_stash = 0`,
        [],
        transaction
      )
      await database.update(
        `INSERT INTO ${this.feishuServer.tableName_FeishuDepartment} (is_stash, open_department_id, department_id, parent_open_department_id, department_name, path, hash) SELECT 0, open_department_id, department_id, parent_open_department_id, department_name, path, hash FROM ${this.feishuServer.tableName_FeishuDepartment} WHERE is_stash = 1`,
        [],
        transaction
      )

      await database.update(
        `INSERT INTO ${this.feishuServer.tableName_FeishuDepartmentMember} (is_stash, open_department_id, union_id, is_leader) SELECT 0, open_department_id, union_id, is_leader FROM ${this.feishuServer.tableName_FeishuDepartmentMember} WHERE is_stash = 1`,
        [],
        transaction
      )
    })

    if (changeLogs.length > 0) {
      const msgNotify = ['部门 / 人员变更: '].concat(changeLogs).join('\n')
      console.info(msgNotify)
      if (this.botCore) {
        this.botCore.notify(msgNotify)
      }
    }
  }

  public async syncRemoteDepartmentsAndUsers() {
    await this.fetchRemoteDepartmentsAndUsers()
    await this.rebaseDepartmentsAndUsersFromStash()
  }
}
