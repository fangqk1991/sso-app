import { __FeishuDepartment } from '../auto-build/__FeishuDepartment'
import { FilterOptions } from 'fc-feed'
import { FeishuDepartmentModel, FeishuDepartmentTree } from '@fangcha/account-models'
import assert from '@fangcha/assert'

export class _FeishuDepartment extends __FeishuDepartment {
  public constructor() {
    super()
  }

  public getClass() {
    return this.constructor as typeof _FeishuDepartment
  }

  public fc_searcher(params: FilterOptions = {}) {
    const searcher = super.fc_searcher(params)
    searcher.processor().addConditionKV('is_stash', 0)
    const keywords = params.keywords || ''
    if (keywords) {
      searcher.processor().addSpecialCondition('department_name LIKE ?', `%${keywords}%`)
    }
    return searcher
  }

  public full_searcher(params: FilterOptions = {}) {
    return super.fc_searcher(params)
  }

  public modelForClient() {
    return {
      openDepartmentId: this.openDepartmentId,
      parentOpenDepartmentId: this.parentOpenDepartmentId,
      departmentName: this.departmentName,
      path: this.path,
      hash: this.hash,
    } as FeishuDepartmentModel
  }

  public static async getRootDepartment() {
    const department = (await this.findOne({
      open_department_id: 0,
    }))!
    assert.ok(!!department, `Root Department Not Found`, 500)
    return department
  }

  public async getAllSubDepartments(withSelf = false) {
    const FeishuDepartment = this.getClass()
    const searcher = new FeishuDepartment().fc_searcher()
    if (!withSelf) {
      searcher.processor().addSpecialCondition('open_department_id != ?', this.openDepartmentId)
    }
    searcher.processor().addSpecialCondition('FIND_IN_SET(?, path)', this.openDepartmentId)
    return searcher.queryAllFeeds()
  }

  public async getStructureInfo(_withMembers = false) {
    const subDepartments = await this.getAllSubDepartments()
    const items = subDepartments.map((feed) => feed.modelForClient())
    const rootVal = this.modelForClient()
    const nodes: FeishuDepartmentTree[] = [rootVal].concat(items).map((item) => {
      return {
        ...item,
        subDepartmentList: [],
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
    // if (withMembers) {
    //   const memberList = await this.getAllMemberInfos()
    //   for (const memberInfo of memberList) {
    //     nodeMap[memberInfo.departmentId].val.members.push(memberInfo)
    //   }
    // }
    return nodes[0]
  }
}
