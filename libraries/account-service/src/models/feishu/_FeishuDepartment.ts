import { __FeishuDepartment } from '../auto-build/__FeishuDepartment'
import { FilterOptions } from 'fc-feed'
import { FeishuDepartmentModel } from '@fangcha/account-models'

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

  public getPathDepartmentIds() {
    return this.path
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
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
    return (await this.findOne({
      open_department_id: 0,
    }))!
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
}
