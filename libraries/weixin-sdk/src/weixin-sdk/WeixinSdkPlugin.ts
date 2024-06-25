import { AppPluginProtocol } from '@fangcha/backend-kit'
import { _RouterState } from '@fangcha/backend-kit/lib/router'
import assert from '@fangcha/assert'
import { WeixinServer } from '../core/WeixinServer'

export interface WeixinSdkOptions {
  weixinServer: WeixinServer
}

export const WeixinSdkPlugin = (options: WeixinSdkOptions): AppPluginProtocol => {
  return {
    appWillLoad: () => {
      assert.ok(!!_RouterState.routerPlugin, 'routerPlugin missing.', 500)
      const weixinServer = options.weixinServer
      const routerApp = _RouterState.routerApp
      routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
        ctx.weixinServer = weixinServer
        await next()
      })
    },
    appDidLoad: () => {},
  }
}
