import { AppPluginProtocol } from '@fangcha/backend-kit'
import { _RouterState } from '@fangcha/backend-kit/lib/router'
import assert from '@fangcha/assert'
import { FeishuServer } from '@fangcha/account'
import { FeishuSdkDocItem } from '../specs'

export interface FeishuSdkOptions {
  feishuServer: FeishuServer
}

export const FeishuSdkPlugin = (options: FeishuSdkOptions): AppPluginProtocol => {
  return {
    appWillLoad: () => {
      assert.ok(!!_RouterState.routerPlugin, 'routerPlugin missing.', 500)
      const feishuServer = options.feishuServer
      const routerApp = _RouterState.routerApp
      routerApp.addDocItem(FeishuSdkDocItem)
      routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
        ctx.feishuServer = feishuServer
        await next()
      })
    },
    appDidLoad: () => {},
  }
}
