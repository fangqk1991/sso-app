import { SsoProtocol } from './SsoProtocol'
import { Context } from 'koa'
import { FangchaSession } from '@fangcha/router/lib/session'
import { OAuthClient } from '../oauth/OAuthClient'
import { RequestFollower } from '@fangcha/app-request-extensions'

class __SsoState {
  public ssoProtocol!: SsoProtocol

  public setSsoProtocol(protocol: SsoProtocol) {
    this.ssoProtocol = protocol
    return this
  }

  public makeOAuthClient(ctx: Context) {
    const oauthConfig = this.ssoProtocol.oauthConfig
    let callbackUri = oauthConfig.callbackUri
    const matches = oauthConfig.callbackUri.match(/^(https?:\/\/.*?)\//)
    if (matches) {
      const session = ctx.session as FangchaSession
      callbackUri = session.correctUrl(callbackUri)
    }
    return new OAuthClient(
      {
        ...oauthConfig,
        callbackUri: callbackUri,
      },
      RequestFollower
    )
  }
}

export const _SsoState = new __SsoState()
