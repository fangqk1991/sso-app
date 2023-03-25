import { FeishuServer } from '@fangcha/account'
import { FeishuClient } from '../core/FeishuClient'
import { FeishuDepartment, FeishuDepartmentTree } from '../core/FeishuModels'
import { SQLBulkAdder } from 'fc-sql'

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
    const departmentList: FeishuDepartment[] = []
    let todoItems = [rootNode]
    while (todoItems.length > 0) {
      for (const item of todoItems) {
        departmentList.push(item.department)
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
        const dbSpec = new feishuServer.FeishuDepartment().dbSpec()
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols())
        departmentList.forEach((item) => {
          const feishuDepartment = new feishuServer.FeishuDepartment()
          feishuDepartment.isStash = 1
          feishuDepartment.openDepartmentId = item.open_department_id
          feishuDepartment.departmentId = item.department_id
          feishuDepartment.parentOpenDepartmentId = item.parent_department_id || ''
          feishuDepartment.departmentName = item.name
          feishuDepartment.path = ''
          feishuDepartment.hash = ''
          feishuDepartment.rawDataStr = JSON.stringify(item)
          bulkAdder.putObject(feishuDepartment.fc_encode())
        })
        await bulkAdder.execute()
      }
    })
  }
}
