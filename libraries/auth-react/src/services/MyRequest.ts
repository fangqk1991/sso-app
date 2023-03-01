import { ApiOptions } from '@fangcha/app-request'
import { HttpRequest } from '@fangcha/auth-basic'
import { message } from 'antd'

HttpRequest.updateClassOptions({
  alertHandler: (errMsg) => {
    message.error(errMsg)
  },
})

export const MyRequest = (commonApi?: ApiOptions) => {
  const builder = new HttpRequest()
  if (commonApi) {
    builder.setApiOptions(commonApi)
  }
  return builder
}
