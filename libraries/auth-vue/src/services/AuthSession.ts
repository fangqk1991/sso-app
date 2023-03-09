import { EmptyConfig, Session } from '@fangcha/vue/basic'
import { RedirectTools } from '@fangcha/auth-basic'
import { WebAuthApis } from '@fangcha/sso-models'

export class AuthSession<T extends EmptyConfig = {}> extends Session<T> {
  public logoutApiPath = WebAuthApis.RedirectLogout.route
  public redirectTools: RedirectTools

  public constructor(config?: T) {
    super(config)
    this.redirectTools = new RedirectTools({
      checkLogin: () => {
        return !!this.curUser
      },
    })
  }

  public async onLoginSuccess() {
    await this.reloadSessionInfo()
    this.redirectIfNeed()
  }

  public redirectIfNeed() {
    this.redirectTools.redirectIfNeed()
  }

  public submitLogin = async (_params: { email: string; password: string }) => {}
}
