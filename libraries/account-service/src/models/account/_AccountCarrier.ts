import { __AccountCarrier } from '../auto-build/__AccountCarrier'
import { AccountCarrierModel, CarrierType } from '@fangcha/account-models'

export class _AccountCarrier extends __AccountCarrier {
  carrierType!: CarrierType

  public constructor() {
    super()
  }

  public modelForClient(): AccountCarrierModel {
    return {
      accountUid: this.accountUid,
      carrierType: this.carrierType,
      carrierUid: this.carrierUid,
    }
  }
}
