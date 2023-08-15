import { __FeishuUser } from '../auto-build/__FeishuUser'
import { FeishuUserModel } from '@fangcha/account-models'
import { FilterOptions } from 'fc-feed'

export class _FeishuUser extends __FeishuUser {
  public constructor() {
    super()
  }

  public fc_searcher(params: FilterOptions = {}) {
    const searcher = super.fc_searcher(params)
    const keywords = params.keywords || ''
    if (keywords) {
      const pattern = `%${keywords}%`
      searcher.processor().addSpecialCondition('name LIKE ? OR email LIKE ?', pattern, pattern)
    }
    return searcher
  }

  public modelForClient(): FeishuUserModel {
    return {
      unionId: this.unionId,
      userId: this.userId,
      openId: this.openId,
      name: this.name,
      city: this.city,
      workLocation: this.workLocation,
      employeeId: this.employeeId,
      isValid: this.isValid,
    }
  }
}
