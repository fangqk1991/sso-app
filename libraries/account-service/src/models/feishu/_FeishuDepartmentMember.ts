import { __FeishuDepartmentMember } from '../auto-build/__FeishuDepartmentMember'
import { FilterOptions } from 'fc-feed'
import { FeishuDepartmentMemberModel } from '@fangcha/account-models'

export class _FeishuDepartmentMember extends __FeishuDepartmentMember {
  public constructor() {
    super()
  }

  public fc_searcher(params: FilterOptions = {}) {
    const searcher = super.fc_searcher(params)
    searcher.processor().addConditionKV('is_stash', 0)
    return searcher
  }

  public full_searcher(params: FilterOptions = {}) {
    return super.fc_searcher(params)
  }

  public modelForClient() {
    return {
      unionId: this.unionId,
      openDepartmentId: this.openDepartmentId,
      isLeader: this.isLeader,
    } as FeishuDepartmentMemberModel
  }
}
