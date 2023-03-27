import { FeishuServer } from '@fangcha/account'
import { FeishuClient } from '../core/FeishuClient'
import { FeishuDepartmentTree } from '../core/FeishuModels'
import { SQLBulkAdder, SQLModifier } from 'fc-sql'

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
          feishuDepartment.path = ''
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
}
