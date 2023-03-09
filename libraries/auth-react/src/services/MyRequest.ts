import { ApiOptions } from '@fangcha/app-request'
import { message } from 'antd'
import { HttpRequest } from '@fangcha/auth-basic'

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
