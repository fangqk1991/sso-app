import { _FeishuUser, FeishuServer } from '@fangcha/account'
import { FeishuClient } from '../core/FeishuClient'
import { FeishuDepartmentTree } from '../core/RawFeishuModels'
import { SQLBulkAdder, SQLModifier } from 'fc-sql'
import { FeishuDepartmentMemberModel, FeishuDepartmentModel } from '@fangcha/account-models'
import { DiffMapper, DiffType } from '@fangcha/tools'

export class FeishuSync {
  private readonly feishuServer: FeishuServer
  private readonly feishuClient: FeishuClient

  public constructor(feishuServer: FeishuServer, feishuClient: FeishuClient) {
    this.feishuServer = feishuServer
    this.feishuClient = feishuClient
  }

  public async fetchRemoteDepartmentsAndUsers() {
    const feishuServer = this.feishuServer
    const feishuClient = this.feishuClient

    const rootNode = await feishuClient.getDepartmentTree('0')
    const departmentNodeList: FeishuDepartmentTree[] = []
    let todoItems = [rootNode]
    while (todoItems.length > 0) {
      for (const item of todoItems) {
        departmentNodeList.push(item)
      }
      const nextItems: FeishuDepartmentTree[] = []
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
        const unionIdList: string[] = []
        const dbSpec = new feishuServer.FeishuUser().dbSpec()
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols())
        departmentNodeList.forEach((item) => {
          item.memberList.forEach((member) => {
            unionIdList.push(member.union_id)

            const feishuUser = new feishuServer.FeishuUser()
            feishuUser.openId = member.open_id
            feishuUser.userId = member.user_id
            feishuUser.unionId = member.union_id
            feishuUser.email = member.email || ''
            feishuUser.name = member.name || ''
            feishuUser.isValid = member.status.is_activated ? 1 : 0
            feishuUser.rawDataStr = JSON.stringify(member)
            bulkAdder.putObject(feishuUser.fc_encode())
          })
        })
        await bulkAdder.execute()

        const modifier = new SQLModifier(database)
        modifier.transaction = transaction
        modifier.setTable(feishuServer.tableName_FeishuUser)
        modifier.updateKV('is_valid', 0)
        modifier.addConditionKeyNotInArray('union_id', unionIdList)
        await modifier.execute()
      }

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
      console.info(['部门 / 人员变更: '].concat(changeLogs).join('\n'))
      // await NotifyHelper.vipNotify2(['部门 / 人员变更: '].concat(changeLogs).join('\n'))
    }
  }

  public async syncRemoteDepartmentsAndUsers() {
    await this.fetchRemoteDepartmentsAndUsers()
    await this.rebaseDepartmentsAndUsersFromStash()
  }
}
