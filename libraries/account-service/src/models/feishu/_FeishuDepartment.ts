import { __FeishuDepartment } from '../auto-build/__FeishuDepartment'
import { FilterOptions } from 'fc-feed'
import { FeishuDepartmentModel } from '@fangcha/account-models'
import assert from '@fangcha/assert'
import { _FeishuDepartmentMember } from './_FeishuDepartmentMember'

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
}
