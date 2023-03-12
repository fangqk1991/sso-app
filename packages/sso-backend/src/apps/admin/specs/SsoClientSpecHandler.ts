import { Context } from 'koa'
import assert from '@fangcha/assert'
import { FangchaSession } from '@fangcha/session'
import { _SsoClient } from '@fangcha/sso-server'
import { MyClientManager } from '../../../services/MyClientManager'

export class SsoClientSpecHandler {
  public readonly ctx: Context

  public constructor(ctx: Context) {
    this.ctx = ctx
  }

  private _client!: _SsoClient
  public async prepareClient() {
    if (!this._client) {
      const ctx = this.ctx
      const client = await MyClientManager.findClient(ctx.params.clientId)
      assert.ok(!!client, `Client[${ctx.params.clientId} Not Exists`)

      const session = ctx.session as FangchaSession
      assert.ok(
        session.checkVisitorIsAdmin() ||
          // session.checkVisitorHasPermission(SsoAdminPermissionKey.OAuthApps) ||
          client.powerUsers().includes(session.curUserStr()),
        `您不是 ${client.clientId} 的管理员，无权操作`,
        403
      )
      this._client = client
    }
    return this._client
  }

  public async handle(handler: (client: _SsoClient) => Promise<void>) {
    const client = await this.prepareClient()
    await handler(client)
  }
}
