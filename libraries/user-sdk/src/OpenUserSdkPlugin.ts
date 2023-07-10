import { AppPluginProtocol, CustomRequestFollower } from '@fangcha/backend-kit'
import { BasicAuthConfig } from '@fangcha/tools'
import { UserProxy } from './core/UserProxy'
import { OpenUserCenter } from './open/OpenUserCenter'
import assert from '@fangcha/assert'
import { _RouterState } from '@fangcha/backend-kit/lib/router'

export const OpenUserSdkPlugin = (config: BasicAuthConfig): AppPluginProtocol => {
  const userProxy = new UserProxy(config, CustomRequestFollower)

  return {
    appWillLoad: () => {
      assert.ok(!!_RouterState.routerPlugin, 'routerPlugin missing.', 500)
      _RouterState.routerPlugin.updateOptions({
        basicAuthProtocol: {
          findVisitor: (username: string, password: string) => {
            return OpenUserCenter.checker().prepareVisitorInfo(username, password)
          },
        },
      })
    },
    appDidLoad: async () => {
      OpenUserCenter.useAutoReloadingChecker(userProxy)
      await OpenUserCenter.waitForReady()
    },
    checkHealth: () => {
      OpenUserCenter.assertValid()
    },
  }
}
