import { AppPluginProtocol } from '@fangcha/backend-kit'
import { SsoProtocol } from '../core/SsoProtocol'
import { _SsoState } from '../core/_SsoState'
import { SsoClientSpecDocItem } from '../specs'

export const SsoSdkPlugin = (options: SsoProtocol): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      _SsoState.setSsoProtocol(options)
    },
    specDocItems: [SsoClientSpecDocItem],
  }
}
