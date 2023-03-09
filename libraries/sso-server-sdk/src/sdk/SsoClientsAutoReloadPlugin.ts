import { AppPluginProtocol, LoopPerformerHelper } from '@fangcha/backend-kit'
import { SsoClientManager } from '@fangcha/sso-server'

export const SsoClientsAutoReloadPlugin = (ssoServer: SsoClientManager): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      await ssoServer.clientUtils.reloadClientsData()
      LoopPerformerHelper.loopHandle(async () => {
        await ssoServer.clientUtils.reloadClientsData()
      })
    },
  }
}
