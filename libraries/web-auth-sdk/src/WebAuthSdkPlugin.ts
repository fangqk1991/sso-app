import { WebAuthProtocol } from './WebAuthProtocol'
import { _WebAuthState } from './_WebAuthState'
import { WebAuthSpecDocItem } from './WebAuthSpecs'
import { AppPluginProtocol } from '@fangcha/backend-kit'
import { JwtSessionSpecDocItem } from '@fangcha/backend-kit/lib/router'

export const WebAuthSdkPlugin = (options: WebAuthProtocol): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      _WebAuthState.setAuthProtocol(options)
    },
    specDocItems: [WebAuthSpecDocItem, JwtSessionSpecDocItem],
  }
}
