import { CarrierType } from './CarrierType'
import { SessionUserInfo } from '@fangcha/app-models'

export interface AccountSimpleParams {
  email: string
  password: string
}

export interface AccountFullParams extends AccountSimpleParams {
  email: string
  password: string
  nickName?: string
  registerIp?: string
}

export interface VisitorCoreInfo extends SessionUserInfo {
  accountUid: string
  email: string
  nickName: string
  extras: { [carrierType: string]: string }
}

export interface PasswordUpdateParams {
  curPassword: string
  newPassword: string
}

export interface AccountModel {
  accountUid: string
  password: string
  isEnabled: number
  nickName: string
  registerIp: string
  createTime: string
  updateTime: string
}

export interface FullAccountModel extends AccountModel {
  email: string
  phone: string
}

export interface AccountCarrierModel {
  accountUid: string
  carrierType: CarrierType
  carrierUid: string
}

export interface AccountProfile extends VisitorCoreInfo {
  nickName: string
  emptyPassword?: boolean
  emptyEmail?: boolean
}
