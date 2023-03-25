import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { FeishuServer } from '@fangcha/account'
import { FCDatabase, SQLBulkAdder } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { FeishuClient, FeishuDepartment, FeishuDepartmentTree } from '../../src'

describe('Test FeishuSync.test.ts', () => {
  const feishuServer = new FeishuServer({
    database: new FCDatabase().init(new DBOptionsBuilder(GlobalAppConfig.FangchaAuth.mysql.ssoDB).build()),
  })
  const feishuClient = new FeishuClient(GlobalAppConfig.FangchaAuth.FeishuSDK, CustomRequestFollower)

  it(`syncStructure`, async () => {
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

    const dbSpec = new feishuServer.FeishuDepartment().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    departmentList.forEach((item) => {
      const feishuDepartment = new feishuServer.FeishuDepartment()
      feishuDepartment.isStash = 0
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
  })
})
