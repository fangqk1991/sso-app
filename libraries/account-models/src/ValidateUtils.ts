import { AppException } from '@fangcha/app-error'
import { AccountSimpleParams } from './AccountCoreModels'
import { AccountErrorPhrase } from './AccountErrorPhrase'

export class ValidateUtils {
  public static validateEmail(email: string) {
    return !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  public static makePureEmailPasswordParams(params: AccountSimpleParams) {
    if (!params.email) {
      throw AppException.exception(AccountErrorPhrase.EmailIncorrect)
    }
    params.email = params.email.trim()
    if (!ValidateUtils.validateEmail(params.email)) {
      throw AppException.exception(AccountErrorPhrase.EmailIncorrect)
    }
    if (!params.password) {
      throw AppException.exception(AccountErrorPhrase.PasswordInvalid)
    }
    return params
  }
}
