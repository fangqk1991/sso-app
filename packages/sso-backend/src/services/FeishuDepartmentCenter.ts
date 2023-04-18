import { MyFeishuServer } from './MyFeishuServer'
import { FeishuDepartmentTree } from '@fangcha/account-models'

class _DepartmentCenter {
  private _directDepartmentMembersMap: { [departmentId: number]: string[] } = {}
  private _fullDepartmentMembersMap: { [departmentId: number]: string[] } = {}

  constructor() {}

  public async reloadData() {
    const rootNode = await MyFeishuServer.getFullStructureInfo()

    const nodeMap: { [p: string]: FeishuDepartmentTree } = {}
    let todoNodes = [rootNode] as FeishuDepartmentTree[]
    while (todoNodes.length > 0) {
      let nextTodoNodes: FeishuDepartmentTree[] = []
      for (const node of todoNodes) {
        nodeMap[node.openDepartmentId] = node
        nextTodoNodes = nextTodoNodes.concat(node.subDepartmentList)
      }
      todoNodes = nextTodoNodes
    }
    const directDepartmentMembersMap: { [departmentId: number]: string[] } = {}
    const members = await new MyFeishuServer.FeishuDepartmentMember().fc_searcher().queryAllFeeds()
    for (const item of members) {
      if (nodeMap[item.openDepartmentId]) {
        nodeMap[item.openDepartmentId].memberList.push(item.modelForClient())
      }
      if (!directDepartmentMembersMap[item.openDepartmentId]) {
        directDepartmentMembersMap[item.openDepartmentId] = []
      }
      directDepartmentMembersMap[item.openDepartmentId].push(item.unionId)
    }
    const fullDepartmentMembersMap: { [departmentId: number]: string[] } = {}
    const handler = (node: FeishuDepartmentTree) => {
      let memberMap = node.memberList.reduce((result, cur) => {
        result[cur.unionId] = true
        return result
      }, {})
      for (const subNode of node.subDepartmentList) {
        const subMap = handler(subNode)
        memberMap = {
          ...memberMap,
          ...subMap,
        }
      }
      fullDepartmentMembersMap[node.openDepartmentId] = Object.keys(memberMap)
      return memberMap
    }
    handler(rootNode)
    this._fullDepartmentMembersMap = fullDepartmentMembersMap
    this._directDepartmentMembersMap = directDepartmentMembersMap
  }

  public getFullDepartmentMembersData() {
    return this._fullDepartmentMembersMap
  }

  public getMembersForDepartment(departmentId: string, isFullDepartment = false): string[] {
    if (!isFullDepartment) {
      return this._directDepartmentMembersMap[departmentId] || []
    }
    return this._fullDepartmentMembersMap[departmentId] || []
  }
}

export const FeishuDepartmentCenter = new _DepartmentCenter()
