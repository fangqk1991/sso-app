import { __AccountCarrierExtras } from '../auto-build/__AccountCarrierExtras'
import { CarrierType } from '@fangcha/account-models'

export class _AccountCarrierExtras extends __AccountCarrierExtras {
  carrierType!: CarrierType

  public constructor() {
    super()
  }

  public static recordCarrierExtras(carrierType: CarrierType, carrierUid: string | number, extrasData: {}) {
    const carrierExtras = new this()
    carrierExtras.carrierType = carrierType
    carrierExtras.carrierUid = `${carrierUid}`
    carrierExtras.extrasInfo = JSON.stringify(extrasData)
    carrierExtras.strongAddToDB().catch((err) => {
      console.error(err)
    })
  }
}
