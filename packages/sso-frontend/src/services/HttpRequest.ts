import { ApiOptions } from '@fangcha/app-request'
import { message } from 'antd'
import { RequestFactory } from '@fangcha/auth-basic'

export const HttpRequest = new RequestFactory({
  alertHandler: (errMsg) => {
    message.error(errMsg)
  },
}).makeClass()

export const MyRequest = (commonApi?: ApiOptions) => {
  const builder = new HttpRequest()
  if (commonApi) {
    builder.setApiOptions(commonApi)
  }
  return builder
}
