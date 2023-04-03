import { _FeishuDepartment } from '../../models/feishu/_FeishuDepartment'
import { FeishuDepartmentTree } from '@fangcha/account-models'
import { FeishuServer } from './FeishuServer'
import { _FeishuUser } from '../../models/feishu/_FeishuUser'

export class FeishuDepartmentHandler {
  department: _FeishuDepartment
  server: FeishuServer

  public constructor(department: _FeishuDepartment, server: FeishuServer) {
    this.department = department
    this.server = server
  }

  public async getStructureInfo(withMembers = false) {
    const FeishuDepartmentMember = this.server.FeishuDepartmentMember
    const FeishuUser = this.server.FeishuUser
    const department = this.department
    const subDepartments = await department.getAllSubDepartments()
    const items = subDepartments.map((feed) => feed.modelForClient())
    const rootVal = department.modelForClient()
    const nodes: FeishuDepartmentTree[] = [rootVal].concat(items).map((item) => {
      return {
        ...item,
        subDepartmentList: [],
        memberList: [],
      } as FeishuDepartmentTree
    })
    const nodeMap: { [p: string]: FeishuDepartmentTree } = nodes.reduce((result, cur) => {
      result[cur.openDepartmentId] = cur
      return result
    }, {})
    for (const node of nodes) {
      if (node.parentOpenDepartmentId && nodeMap[node.parentOpenDepartmentId]) {
        nodeMap[node.parentOpenDepartmentId].subDepartmentList.push(node)
      }
    }
    if (withMembers) {
      const subDepartments = await department.getAllSubDepartments(true)
      const searcher = new FeishuDepartmentMember().fc_searcher()
      searcher.processor().addConditionKeyInArray(
        'open_department_id',
        subDepartments.map((item) => item.openDepartmentId)
      )
      const memberList = await searcher.queryAllFeeds()
      const userSearcher = new FeishuUser().fc_searcher()
      userSearcher.processor().addConditionKeyInArray(
        'union_id',
        memberList.map((item) => item.unionId)
      )
      const userItems = await userSearcher.queryAllFeeds()
      const userMap: { [p: string]: _FeishuUser } = userItems.reduce((result, cur) => {
        result[cur.unionId] = cur
        return result
      }, {})
      for (const item of memberList) {
        const member = item.modelForClient()
        member.name = userMap[member.unionId] ? userMap[member.unionId].name : ''
        nodeMap[member.openDepartmentId].memberList.push(member)
      }
    }
    return nodes[0]
  }
}
