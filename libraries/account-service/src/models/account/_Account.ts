import { __Account } from '../auto-build/__Account'
import * as bcrypt from 'bcrypt'
import { AppException } from '@fangcha/app-error'
import { AccountErrorPhrase, AccountModel, CarrierType, VisitorCoreInfo } from '../../common/models'
import { _AccountCarrier } from './_AccountCarrier'

export class _Account extends __Account {
  public static AccountCarrier: typeof _AccountCarrier & { new (): _AccountCarrier }

  public getClass() {
    return this.constructor as typeof _Account
  }

  public assertPasswordCorrect(password: string) {
    if (!bcrypt.compareSync(password, this.password)) {
      throw AppException.exception(AccountErrorPhrase.PasswordIncorrect)
    }
  }

  public async findCarrier(carrierType: CarrierType) {
    return (await this.getClass().AccountCarrier.findOne({
      account_uid: this.accountUid,
      carrier_type: carrierType,
    }))!
  }

  public async updateCarrier(carrierType: CarrierType, carrierUid: string) {
    const carrier = await this.findCarrier(carrierType)
    if (carrier) {
      carrier.fc_edit()
      carrier.carrierUid = carrierUid
      await carrier.updateToDB()
    } else {
      const AccountCarrier = this.getClass().AccountCarrier
      const carrier = new AccountCarrier()
      carrier.accountUid = this.accountUid
      carrier.carrierType = carrierType
      carrier.carrierUid = carrierUid
      await carrier.addToDB()
    }
  }

  public async getVisitorCoreInfo(): Promise<VisitorCoreInfo> {
    const carrier = await this.findCarrier(CarrierType.Email)
    return {
      accountUid: this.accountUid,
      email: carrier ? carrier.carrierUid : '',
    }
  }

  public modelForClient() {
    const data = this.fc_pureModel() as AccountModel
    data.password = '***'
    return data
  }

  public toJSON() {
    return this.modelForClient()
  }
}
