import { __FeishuDepartment } from '../auto-build/__FeishuDepartment'
import { FilterOptions } from 'fc-feed'
import { FeishuDepartmentModel } from '@fangcha/account-models'

export class _FeishuDepartment extends __FeishuDepartment {
  public constructor() {
    super()
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
}
