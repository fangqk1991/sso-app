import { __FeishuUser } from '../auto-build/__FeishuUser'
import { FeishuUserModel } from '@fangcha/account-models'

export class _FeishuUser extends __FeishuUser {
  public constructor() {
    super()
  }

  public modelForClient(): FeishuUserModel {
    return {
      unionId: this.unionId,
      userId: this.userId,
      openId: this.openId,
      name: this.name,
      isValid: this.isValid,
    }
  }
}
