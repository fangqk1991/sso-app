import { Descriptor } from '@fangcha/tools'

export enum CarrierType {
  Email = 'Email',
  Phone = 'Phone',
  Google = 'Google',
  GitHub = 'GitHub',
  Wechat = 'Wechat',
  Feishu = 'Feishu',
}

const values = [
  CarrierType.Email,
  CarrierType.Phone,
  CarrierType.Google,
  CarrierType.GitHub,
  CarrierType.Wechat,
  CarrierType.Feishu,
]

const describe = (code: CarrierType) => {
  return code
}

export const CarrierTypeDescriptor = new Descriptor(values, describe)

export type AccountCarrierData = Record<keyof typeof CarrierType, string>

export interface AccountCarrierDataFull extends AccountCarrierData {
  extrasData: Partial<Record<keyof typeof CarrierType, { username: string; avatar?: string }>>
}
