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

export interface VisitorCoreInfo {
  accountUid: string
  email: string
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
