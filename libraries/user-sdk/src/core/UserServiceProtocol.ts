import { AppFullInfo } from '@fangcha/account-models'

export interface UserServiceProtocol {
  getAppFullInfo: () => Promise<AppFullInfo>
  getAppVersion: () => Promise<number>
}
