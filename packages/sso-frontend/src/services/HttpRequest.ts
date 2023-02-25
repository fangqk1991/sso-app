import { ApiOptions } from '@fangcha/app-request'
import { HttpRequest } from '@fangcha/auth-basic'

export const MyRequest = (commonApi?: ApiOptions) => {
  const builder = new HttpRequest()
  if (commonApi) {
    builder.setApiOptions(commonApi)
  }
  return builder
}
