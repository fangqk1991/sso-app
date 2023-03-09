import { axiosGET } from '@fangcha/app-request'
import { AppPluginProtocol } from '@fangcha/backend-kit'
import { _SsoState } from '../core/_SsoState'
import { TypicalSsoProtocol } from '../core/TypicalSsoProtocol'
import { SsoClientSpecDocItem } from '../specs'

export const TypicalSsoSdkPlugin = (protocol: TypicalSsoProtocol): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      _SsoState.setSsoProtocol({
        ...protocol,
        getUserInfo: async (accessToken: string) => {
          const request = axiosGET(protocol.oauthConfig.userInfoURL)
          request.addHeader('Authorization', `Bearer ${accessToken}`)
          return request.quickSend()
        },
      })
    },
    specDocItems: [SsoClientSpecDocItem],
  }
}
